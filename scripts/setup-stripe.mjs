#!/usr/bin/env node
/**
 * ♠ Dossiery — setup automático do Stripe (produtos + preços + webhook)
 *
 * Cria tudo que o funil precisa, sem clicar no painel. É idempotente:
 * pode rodar quantas vezes quiser que não duplica.
 *
 * USO (rode LOCAL, sua chave nunca sai da sua máquina):
 *   STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe.mjs [URL_DO_WEBHOOK]
 *
 * Exemplo:
 *   STRIPE_SECRET_KEY=sk_test_xxx \
 *     node scripts/setup-stripe.mjs https://app.dossiery.com.br/api/webhooks/stripe
 *
 * Comece com a chave de TESTE (sk_test_...). Depois de validar a compra-teste,
 * rode de novo com a chave LIVE (sk_live_...) para criar os preços de produção.
 */

import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('❌ Defina STRIPE_SECRET_KEY. Comece pela chave de TESTE: sk_test_...')
  process.exit(1)
}
const stripe = new Stripe(key)
const webhookUrl = process.argv[2] || null
const modo = key.startsWith('sk_live') ? 'LIVE 🔴 (produção!)' : 'TESTE 🟢'

console.log(`\n♠ Dossiery · setup Stripe — modo ${modo}\n`)

// ── idempotência por metadata (sem depender da Search API) ──
async function acharOuCriarProduto(nome, tag) {
  const lista = await stripe.products.list({ limit: 100, active: true })
  const achado = lista.data.find((p) => p.metadata?.dossiery === tag)
  if (achado) {
    console.log(`• produto ok:   ${nome}`)
    return achado
  }
  const p = await stripe.products.create({ name: nome, metadata: { dossiery: tag } })
  console.log(`• produto criado: ${nome}`)
  return p
}

async function acharOuCriarPrice({ product, lookup, amount, recurring }) {
  const achado = await stripe.prices.list({ lookup_keys: [lookup], limit: 1 })
  if (achado.data[0]) {
    console.log(`  price ok:     ${lookup} → ${achado.data[0].id}`)
    return achado.data[0]
  }
  const p = await stripe.prices.create({
    product,
    currency: 'brl',
    unit_amount: amount,
    lookup_key: lookup,
    ...(recurring ? { recurring: { interval: 'month' } } : {}),
  })
  console.log(`  price criado: ${lookup} → ${p.id}`)
  return p
}

try {
  const prodOperador = await acharOuCriarProduto('Dossiery — Operador', 'operador')
  const prodBump = await acharOuCriarProduto('Dossiery — Kit 50 Aberturas', 'bump')
  const prodEncontro = await acharOuCriarProduto('Dossiery — Protocolo Encontro', 'encontro')
  const prodPlano7 = await acharOuCriarProduto('Dossiery — Plano 7 Dias', 'plano7')
  const prodPerfil = await acharOuCriarProduto('Dossiery — Perfil Magnético', 'perfil')
  const prodRecomeco = await acharOuCriarProduto('Dossiery — Protocolo Recomeço', 'recomeco')

  const mensal = await acharOuCriarPrice({
    product: prodOperador.id, lookup: 'dossiery_mensal', amount: 9700, recurring: true,
  })
  const anual = await acharOuCriarPrice({
    product: prodOperador.id, lookup: 'dossiery_anual', amount: 69700, recurring: false,
  })
  const bump = await acharOuCriarPrice({
    product: prodBump.id, lookup: 'dossiery_bump', amount: 3700, recurring: false,
  })
  // Funil do Protocolo Encontro: OTO pós-compra (R$97, janela 60min),
  // downsell (R$47, mesma janela) e preço cheio dentro do app (R$147).
  const encontroOto = await acharOuCriarPrice({
    product: prodEncontro.id, lookup: 'dossiery_encontro_oto', amount: 9700, recurring: false,
  })
  const encontroDown = await acharOuCriarPrice({
    product: prodEncontro.id, lookup: 'dossiery_encontro_down', amount: 4700, recurring: false,
  })
  const encontroApp = await acharOuCriarPrice({
    product: prodEncontro.id, lookup: 'dossiery_encontro_app', amount: 14700, recurring: false,
  })
  // Esteira: tripwire do quiz + Perfil Magnético + Protocolo Recomeço
  const plano7 = await acharOuCriarPrice({
    product: prodPlano7.id, lookup: 'dossiery_plano7', amount: 1900, recurring: false,
  })
  const perfilOto = await acharOuCriarPrice({
    product: prodPerfil.id, lookup: 'dossiery_perfil_oto', amount: 4700, recurring: false,
  })
  const perfilApp = await acharOuCriarPrice({
    product: prodPerfil.id, lookup: 'dossiery_perfil_app', amount: 6700, recurring: false,
  })
  const recomecoOto = await acharOuCriarPrice({
    product: prodRecomeco.id, lookup: 'dossiery_recomeco_oto', amount: 9700, recurring: false,
  })
  const recomecoApp = await acharOuCriarPrice({
    product: prodRecomeco.id, lookup: 'dossiery_recomeco_app', amount: 14700, recurring: false,
  })
  // Degraus REAIS de fundador (o servidor escolhe pelo contador do banco)
  const anualT1 = await acharOuCriarPrice({
    product: prodOperador.id, lookup: 'dossiery_anual_t1', amount: 49700, recurring: false,
  })
  const anualT2 = await acharOuCriarPrice({
    product: prodOperador.id, lookup: 'dossiery_anual_t2', amount: 59700, recurring: false,
  })
  const anualT3 = await acharOuCriarPrice({
    product: prodOperador.id, lookup: 'dossiery_anual_t3', amount: 69700, recurring: false,
  })
  // Tier alto + upsell pós-tripwire com os R$19 creditados
  const prodComandante = await acharOuCriarProduto('Dossiery — Comandante', 'comandante')
  const comandante = await acharOuCriarPrice({
    product: prodComandante.id, lookup: 'dossiery_comandante', amount: 129700, recurring: false,
  })
  const operadorCredito = await acharOuCriarPrice({
    product: prodOperador.id, lookup: 'dossiery_operador_credito', amount: 47800, recurring: false,
  })

  let whsec = null
  if (webhookUrl) {
    const eventos = [
      'checkout.session.completed',
      'checkout.session.async_payment_succeeded',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ]
    const todos = await stripe.webhookEndpoints.list({ limit: 100 })
    const ja = todos.data.find((w) => w.url === webhookUrl)
    if (ja) {
      console.log(`\n• webhook já existe para essa URL (o secret só aparece na criação;`)
      console.log(`  se precisar do whsec, apague o endpoint no painel e rode de novo)`)
    } else {
      const w = await stripe.webhookEndpoints.create({
        url: webhookUrl, enabled_events: eventos, metadata: { dossiery: 'principal' },
      })
      whsec = w.secret
      console.log(`\n• webhook criado: ${webhookUrl}`)
    }
  } else {
    console.log('\n• (sem webhook — passe a URL como 1º argumento para criá-lo)')
  }

  // ── Portal do cliente (cancelar/atualizar cartão) ──
  try {
    await stripe.billingPortal.configurations.create({
      business_profile: { headline: 'Dossiery — gerencie seu Protocolo' },
      features: {
        customer_update: { enabled: true, allowed_updates: ['email'] },
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        subscription_cancel: { enabled: true, mode: 'at_period_end' },
      },
    })
    console.log('• portal do cliente configurado')
  } catch {
    console.log('• portal do cliente: já configurado (ok)')
  }

  console.log('\n════════════ COLE NAS ENVs (Vercel + .env.local) ════════════')
  console.log(`STRIPE_PRICE_MENSAL=${mensal.id}`)
  console.log(`STRIPE_PRICE_ANUAL=${anual.id}`)
  console.log(`STRIPE_PRICE_BUMP=${bump.id}`)
  console.log(`STRIPE_PRICE_ENCONTRO_OTO=${encontroOto.id}`)
  console.log(`STRIPE_PRICE_ENCONTRO_DOWN=${encontroDown.id}`)
  console.log(`STRIPE_PRICE_ENCONTRO_APP=${encontroApp.id}`)
  console.log(`STRIPE_PRICE_PLANO7=${plano7.id}`)
  console.log(`STRIPE_PRICE_PERFIL_OTO=${perfilOto.id}`)
  console.log(`STRIPE_PRICE_PERFIL_APP=${perfilApp.id}`)
  console.log(`STRIPE_PRICE_RECOMECO_OTO=${recomecoOto.id}`)
  console.log(`STRIPE_PRICE_RECOMECO_APP=${recomecoApp.id}`)
  console.log(`STRIPE_PRICE_ANUAL_T1=${anualT1.id}`)
  console.log(`STRIPE_PRICE_ANUAL_T2=${anualT2.id}`)
  console.log(`STRIPE_PRICE_ANUAL_T3=${anualT3.id}`)
  console.log(`STRIPE_PRICE_COMANDANTE=${comandante.id}`)
  console.log(`STRIPE_PRICE_OPERADOR_CREDITO=${operadorCredito.id}`)
  if (whsec) console.log(`STRIPE_WEBHOOK_SECRET=${whsec}`)
  console.log('═════════════════════════════════════════════════════════════')
  console.log('\n✅ Stripe pronto. Agora:')
  console.log('   1. Ative o PIX: painel → Settings → Payment methods → Pix')
  console.log('   2. Copie as envs acima para a Vercel')
  console.log('   3. Compra-teste: cartão 4242 4242 4242 4242 (qualquer validade futura/CVC)\n')
} catch (err) {
  console.error('\n❌ Erro:', err?.message || err)
  console.error('   Confira se a chave está correta e tem permissão de escrita.')
  process.exit(1)
}

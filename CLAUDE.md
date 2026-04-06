# ⚔️ EXCALIBUR APP — Produto para Clínicas

## IDENTIDADE
Este é o **excalibur-app** — SaaS multi-tenant para clínicas odontológicas.
Cada clínica vê APENAS seus dados via RLS.

## STACK
Next.js 16 + TypeScript + Tailwind CSS 4 + Supabase + Vercel
URL: excalibur-app.vercel.app → app.excalibur.com.br

## MÓDULOS
- Login (auth por clínica com clinica_id)
- Dashboard (métricas da clínica)
- CRM / Leads
- Pacientes
- Agenda
- Financeiro / Excalibur Pay
- BI da clínica

## MULTI-TENANT
- Todas as tabelas têm `clinica_id`
- RLS: `clinica_id = auth.jwt() ->> 'clinica_id'`
- NUNCA mostrar dados de outra clínica

## VISUAL
Dark mode gray-950 + amber-500 SEMPRE. Zero light mode.

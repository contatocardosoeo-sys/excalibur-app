'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// IDs via env pública — sem ID, nenhum script é carregado.
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID
const GA4 = process.env.NEXT_PUBLIC_GA4_ID

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// Meta Pixel + GA4 do funil Dossiery.
// PageView em toda navegação; InitiateCheckout dispara na página de preços;
// Purchase dispara em /dossiery/bem-vindo (com valor e eventID p/ dedup).
export default function Pixels() {
  const pathname = usePathname()
  const primeira = useRef(true)

  useEffect(() => {
    // O primeiro PageView sai no init dos snippets; aqui só navegações seguintes
    if (primeira.current) {
      primeira.current = false
      return
    }
    window.fbq?.('track', 'PageView')
    if (GA4) window.gtag?.('config', GA4, { page_path: pathname })
  }, [pathname])

  if (!PIXEL && !GA4) return null

  return (
    <>
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL}');
fbq('track','PageView');`}
        </Script>
      )}
      {GA4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA4}');`}
          </Script>
        </>
      )}
    </>
  )
}

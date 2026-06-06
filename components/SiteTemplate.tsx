/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { HEY_TELO_PHONE_NUMBER, siteOrigin } from "@/lib/config";
import type { PageId, SiteConfig } from "@/lib/types";
import { isWeekend } from "@/lib/utils";
import { InquiryForm } from "@/components/InquiryForm";

const pageLabels: Record<PageId, string> = {
  leistungen: "Leistungen",
  "ueber-uns": "Über uns",
  kontakt: "Kontakt",
};

function CallButton({ floating = false }: { floating?: boolean }) {
  return (
    <a className={floating ? "floating-call" : "site-call"} href={`tel:${HEY_TELO_PHONE_NUMBER}`}>
      <span aria-hidden="true">☎</span> Jetzt anrufen
    </a>
  );
}

function Services({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section" id="leistungen">
      <p className="customer-eyebrow">Was wir für Sie tun</p>
      <h2>Unsere Leistungen</h2>
      <div className="service-grid">
        {site.profile.services.map((service, index) => (
          <article key={service}><span>0{index + 1}</span><h3>{service}</h3><p>Persönliche Beratung und fachgerechte Ausführung aus einer Hand.</p></article>
        ))}
      </div>
    </section>
  );
}

function About({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section split-section" id="ueber-uns">
      <div><p className="customer-eyebrow">Ihr Fachbetrieb</p><h2>Über {site.profile.name}</h2></div>
      <p>{site.profile.description}</p>
    </section>
  );
}

function Hours() {
  return (
    <section className="customer-section hours-section">
      <p className="customer-eyebrow">Erreichbarkeit</p><h2>Wir sind für Sie da</h2>
      <div className="hours-grid"><span>Montag – Freitag</span><strong>07:00 – 18:00 Uhr</strong><span>Samstag & Sonntag</span><strong>Hey Telo nimmt Ihren Anruf entgegen</strong></div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="customer-section reviews-section">
      <p className="customer-eyebrow">Kundenstimmen</p><h2>Darauf können Sie sich verlassen</h2>
      <div className="review-cards">{["Schnelle Rückmeldung und saubere Arbeit.", "Freundlich, verbindlich und professionell.", "Von der Beratung bis zur Umsetzung top."].map((review) => <blockquote key={review}><b>★★★★★</b><p>„{review}“</p></blockquote>)}</div>
    </section>
  );
}

function Gallery({ site }: { site: SiteConfig }) {
  const images = site.profile.imageUrls.filter((url) => !/\.svg(?:\?|$)/i.test(url)).slice(0, 6);
  return (
    <section className="customer-section gallery-section">
      <p className="customer-eyebrow">Unsere Arbeit</p><h2>Projekte und Eindrücke</h2>
      <div className="gallery-grid">{images.length ? images.map((url, index) => <img key={url} src={url} alt={`Projekt von ${site.profile.name} ${index + 1}`} />) : site.profile.services.slice(0, 4).map((service) => <div key={service}>{service}</div>)}</div>
    </section>
  );
}

function Area({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section area-section">
      <p className="customer-eyebrow">Für Sie vor Ort</p><h2>Unser Einsatzgebiet</h2><p>{site.profile.serviceArea}</p>
    </section>
  );
}

function Faq({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section faq-section">
      <p className="customer-eyebrow">Häufige Fragen</p><h2>Gut zu wissen</h2>
      <details open><summary>Welche Leistungen bieten Sie an?</summary><p>Wir beraten Sie persönlich zu {site.profile.services.slice(0, 3).join(", ")} und weiteren Anliegen.</p></details>
      <details><summary>In welchem Gebiet sind Sie tätig?</summary><p>Unser Einsatzgebiet ist {site.profile.serviceArea}.</p></details>
      <details><summary>Wie erreiche ich Sie am schnellsten?</summary><p>Rufen Sie direkt an. Hey Telo nimmt Ihre Anfrage jederzeit zuverlässig auf.</p></details>
    </section>
  );
}

function Contact({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section contact-section" id="kontakt">
      <div><p className="customer-eyebrow">Direkter Kontakt</p><h2>Wie können wir helfen?</h2><p>{site.profile.phone}</p><p>{site.profile.email}</p><p>{site.profile.address}</p></div>
      <InquiryForm siteId={site.id} />
    </section>
  );
}

function Hero({ site }: { site: SiteConfig }) {
  const image = site.profile.imageUrls.find((url) => !/\.svg(?:\?|$)/i.test(url));
  return (
    <section className={`customer-hero hero-layout-${site.design.heroLayout}`} style={image ? { "--hero-image": `url("${image}")` } as CSSProperties : undefined}>
      <div className="hero-copy">
        <p className="customer-eyebrow">{site.profile.trade} · {site.profile.serviceArea}</p>
        <h1>{site.profile.name}</h1><p>{site.profile.description}</p>
        <div className="hero-actions"><CallButton /><a href="#kontakt">Anfrage senden</a></div>
        {site.design.heroLayout === "trust-forward" && <div className="trust-badges"><span>✓ Meisterbetrieb</span><span>✓ Direkt erreichbar</span><span>✓ Persönlich vor Ort</span></div>}
      </div>
      {site.design.heroLayout !== "minimal" && <div className="hero-visual">{image ? <img src={image} alt={`${site.profile.trade} von ${site.profile.name}`} /> : <span>{site.profile.trade}</span>}</div>}
    </section>
  );
}

const sectionRenderers: Record<string, (site: SiteConfig) => ReactNode> = {
  services: (site) => <Services site={site} />,
  about: (site) => <About site={site} />,
  hours: () => <Hours />,
  reviews: () => <Reviews />,
  gallery: (site) => <Gallery site={site} />,
  contact: (site) => <Contact site={site} />,
  map: (site) => <Area site={site} />,
  faq: (site) => <Faq site={site} />,
};

export function SiteTemplate({ site, page }: { site: SiteConfig; page?: string }) {
  const [dark, accent, light, muted] = site.design.palette.colors;
  const origin = siteOrigin(site.slug);
  const style = {
    "--site-accent": accent,
    "--site-dark": dark,
    "--site-light": light,
    "--site-muted": muted,
    "--site-heading": site.design.font.heading,
    "--site-body": site.design.font.body,
  } as CSSProperties;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "HomeAndConstructionBusiness",
    name: site.profile.name, description: site.profile.description, telephone: site.profile.phone,
    email: site.profile.email, address: site.profile.address, areaServed: site.profile.serviceArea,
    url: origin, sameAs: [site.profile.sourceUrl],
  };

  let pageContent: ReactNode = null;
  if (page === "leistungen") pageContent = <Services site={site} />;
  if (page === "ueber-uns") pageContent = <About site={site} />;
  if (page === "kontakt") pageContent = <Contact site={site} />;

  return (
    <div className={`customer-site customer-template-${site.design.template.id}`} style={style}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {site.design.sections.includes("emergency") && <div className="emergency-banner">24/7 Notdienst: Rufen Sie jetzt an · <a href={`tel:${HEY_TELO_PHONE_NUMBER}`}>{HEY_TELO_PHONE_NUMBER}</a></div>}
      {isWeekend() && <div className="weekend-banner">Auch am Wochenende erreichbar: Hey Telo nimmt Ihren Anruf entgegen.</div>}
      <header className="customer-header">
        <Link className="customer-logo" href={origin}>{site.profile.name}</Link>
        <nav><Link href={origin}>Start</Link>{site.pages.map((item) => <Link key={item} href={`${origin}/${item}`}>{pageLabels[item]}</Link>)}</nav>
        <CallButton />
      </header>

      {pageContent || <><Hero site={site} />{site.design.sections.filter((section) => section !== "hero" && section !== "emergency").map((section) => <div key={section}>{sectionRenderers[section]?.(site)}</div>)}</>}

      <footer className="customer-footer"><strong>{site.profile.name}</strong><span>{site.profile.address}</span><a href={`tel:${HEY_TELO_PHONE_NUMBER}`}>Anrufen</a></footer>
      <CallButton floating />
    </div>
  );
}

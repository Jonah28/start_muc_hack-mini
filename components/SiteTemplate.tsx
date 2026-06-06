/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { HEY_TELO_PHONE_NUMBER, siteOrigin } from "@/lib/config";
import type { PageId, SiteConfig, SiteImageAsset } from "@/lib/types";
import { isWeekend } from "@/lib/utils";
import { InquiryForm } from "@/components/InquiryForm";
import { AnimatedHero } from "./heroes/AnimatedHero";
import { AuroraFlow } from "./heroes/AuroraFlow";
import { ShaderShowcase } from "./heroes/ShaderShowcase";
import { LandingAccordion } from "./heroes/LandingAccordion";

const GALLERY_IMAGES = [
  "/hack-images/craftsman_at_work_bathroom.png",
  "/hack-images/overtheshoulder_tiling_woman.png",
  "/hack-images/two_craftsmen_at_work_kitchen.png",
  "/hack-images/Badsanierung.png",
  "/hack-images/Fliesenbearbeitung.png",
  "/hack-images/Küchenmontage.png"
];

const pageLabels: Record<PageId, string> = {
  leistungen: "Leistungen",
  "ueber-uns": "Über uns",
  kontakt: "Kontakt",
};

function CallButton({ floating = false }: { floating?: boolean }) {
  return (
    <a className={floating ? "floating-call" : "site-call"} href={`tel:${HEY_TELO_PHONE_NUMBER}`}>
      <span aria-hidden="true">☎</span> {HEY_TELO_PHONE_NUMBER}
    </a>
  );
}

function Services({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section" id="leistungen">
      <p className="customer-eyebrow">Was wir für Sie tun</p>
      <h2>Unsere Leistungen</h2>
      <div className="service-grid">
        {site.content.services.services.slice(0, 3).map((service, index) => (
          <article key={service.name}><span>0{index + 1}</span><h3>{service.name}</h3><p>{service.description}</p></article>
        ))}
      </div>
    </section>
  );
}

function About({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section split-section" id="ueber-uns">
      <img className="generated-site-image" src="/hack-images/centred_confident_portrait_woman.png" alt={`Team von ${site.profile.name}`} />
      <div><p className="customer-eyebrow">Ihr Fachbetrieb</p><h2>Über {site.profile.name}</h2>
      <p>{site.content.about.intro}</p></div>
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
  const images = GALLERY_IMAGES.slice(0, 6);
  return (
    <section className="customer-section gallery-section">
      <p className="customer-eyebrow">Unsere Arbeit</p><h2>Projekte und Eindrücke</h2>
      <div className="gallery-grid">{images.map((url, index) => <img className="generated-site-image" key={url} src={url} alt={`Projekt von ${site.profile.name} ${index + 1}`} />)}</div>
    </section>
  );
}

function Area({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section area-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <img style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} src="/hack-images/two_craftsmen_at_work_kitchen.png" alt="" />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <p className="customer-eyebrow">Für Sie vor Ort</p><h2>Unser Einsatzgebiet</h2><p>{site.profile.serviceArea}</p>
      </div>
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
      <div><p className="customer-eyebrow">Direkter Kontakt</p><h2>Wie können wir helfen?</h2><p>{HEY_TELO_PHONE_NUMBER}</p><p>{site.profile.email}</p><p>{site.profile.address}</p></div>
      <InquiryForm siteId={site.id} />
    </section>
  );
}

function SiteImage({ asset, label }: { asset: SiteImageAsset; label: string }) {
  let mappedImg = "/hack-images/Renovierung.png";
  if (label.includes("Titelbild")) mappedImg = "/hack-images/craftsman_greeting_smiling.png";
  if (label.includes("Prozessbild")) mappedImg = "/hack-images/craftsman_on_ ladder_smiling.png";
  if (label.includes("Einblick")) mappedImg = "/hack-images/centred_confident_portrait_woman.png";
  if (label.includes("Einsatzgebiet")) mappedImg = "/hack-images/two_craftsmen_at_work_kitchen.png";
  return <img className="generated-site-image" src={mappedImg} alt={asset.alt || label} />;
}

function PageHero({
  site,
  eyebrow,
  title,
  intro,
  image,
}: {
  site: SiteConfig;
  eyebrow: string;
  title: string;
  intro: string;
  image: SiteImageAsset;
}) {
  return (
    <section className="subpage-hero">
      <div>
        <p className="customer-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div className="hero-actions"><CallButton /><Link href={`${siteOrigin(site.slug)}/kontakt`}>Anfrage senden</Link></div>
      </div>
      <SiteImage asset={image} label="Geplantes Titelbild" />
    </section>
  );
}

function ServicesPage({ site }: { site: SiteConfig }) {
  const content = site.content.services;
  return (
    <>
      <PageHero site={site} eyebrow={content.eyebrow} title={content.title} intro={content.intro} image={content.images.hero} />
      <Services site={site} />
      <section className="customer-section process-section">
        <SiteImage asset={content.images.feature} label="Geplantes Prozessbild" />
        <div>
          <p className="customer-eyebrow">Von der Anfrage bis zum Ergebnis</p>
          <h2>{content.processTitle}</h2>
          <p>{content.processIntro}</p>
          <ol>{content.processSteps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
        </div>
      </section>
    </>
  );
}

function AboutPage({ site }: { site: SiteConfig }) {
  const content = site.content.about;
  return (
    <>
      <PageHero site={site} eyebrow={content.eyebrow} title={content.title} intro={content.intro} image={content.images.hero} />
      <section className="customer-section story-section">
        <div><p className="customer-eyebrow">Über {site.profile.name}</p><h2>Persönlich. Verlässlich. Vor Ort.</h2>{content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <SiteImage asset={content.images.feature} label="Geplanter Einblick in den Betrieb" />
      </section>
      <section className="customer-section values-section">
        <p className="customer-eyebrow">Was uns wichtig ist</p><h2>Darauf können Sie bauen</h2>
        <div>{content.values.map((value) => <article key={value.title}><h3>{value.title}</h3><p>{value.description}</p></article>)}</div>
      </section>
    </>
  );
}

function ContactPage({ site }: { site: SiteConfig }) {
  const content = site.content.contact;
  return (
    <>
      <PageHero site={site} eyebrow={content.eyebrow} title={content.title} intro={content.intro} image={content.images.hero} />
      <section className="customer-section contact-page-section">
        <div className="contact-details">
          <p className="customer-eyebrow">Wir melden uns zurück</p><h2>Ihr direkter Kontakt</h2><p>{content.callbackText}</p>
          <a href={`tel:${HEY_TELO_PHONE_NUMBER}`}><strong>{HEY_TELO_PHONE_NUMBER}</strong><span>Jetzt über Hey Telo anrufen</span></a>
          <a href={`mailto:${site.profile.email}`}><strong>{site.profile.email}</strong><span>E-Mail senden</span></a>
          <p>{site.profile.address}</p>
        </div>
        <InquiryForm siteId={site.id} />
      </section>
      <section className="customer-section contact-area-section">
        <SiteImage asset={content.images.feature} label="Geplantes Bild aus dem Einsatzgebiet" />
        <div><p className="customer-eyebrow">Einsatzgebiet</p><h2>{site.profile.serviceArea}</h2><p>{content.areaText}</p></div>
      </section>
    </>
  );
}

function Hero({ site }: { site: SiteConfig }) {
  if (site.design.heroLayout === "full-bleed") return <AnimatedHero site={site} />;
  if (site.design.heroLayout === "trust-forward") return <AuroraFlow site={site} />;
  if (site.design.heroLayout === "minimal") return <ShaderShowcase site={site} />;
  if (site.design.heroLayout === "split") return <LandingAccordion site={site} />;
  return <AnimatedHero site={site} />;
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
    name: site.profile.name, description: site.profile.description, telephone: HEY_TELO_PHONE_NUMBER,
    email: site.profile.email, address: site.profile.address, areaServed: site.profile.serviceArea,
    url: origin, sameAs: [site.profile.sourceUrl],
  };

  let pageContent: ReactNode = null;
  if (page === "leistungen") pageContent = <ServicesPage site={site} />;
  if (page === "ueber-uns") pageContent = <AboutPage site={site} />;
  if (page === "kontakt") pageContent = <ContactPage site={site} />;

  return (
    <div className={`customer-site customer-template-${site.design.template.id}`} style={style}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="customer-header">
        <Link className="customer-logo" href={origin}>{site.profile.name}</Link>
        <nav><Link href={origin}>Start</Link>{site.pages.map((item) => <Link key={item} href={`${origin}/${item}`}>{pageLabels[item]}</Link>)}</nav>
        <CallButton />
      </header>

      {pageContent || <><Hero site={site} />{site.design.sections.filter((section) => section !== "hero" && section !== "emergency").map((section) => <div key={section}>{sectionRenderers[section]?.(site)}</div>)}</>}

      <footer className="customer-footer">
        <div>
          <strong>{site.profile.name}</strong><span>{site.profile.address}</span><a href={`tel:${HEY_TELO_PHONE_NUMBER}`}>Anrufen</a>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.6 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Impressum</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Datenschutz</a>
        </div>
      </footer>
      <CallButton floating />
    </div>
  );
}

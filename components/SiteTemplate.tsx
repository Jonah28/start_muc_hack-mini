/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
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

const palette = {
  blau: { accent: "#195f92", dark: "#123046", light: "#e9f3fa" },
  gruen: { accent: "#2d6a4f", dark: "#173a2b", light: "#e7f2ec" },
  orange: { accent: "#c45d18", dark: "#51280d", light: "#fbefe5" },
  anthrazit: { accent: "#424952", dark: "#1e2228", light: "#eef0f2" },
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

function Area({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section area-section">
      <p className="customer-eyebrow">Für Sie vor Ort</p>
      <h2>Unser Einsatzgebiet</h2>
      <p>{site.profile.serviceArea}</p>
    </section>
  );
}

function Contact({ site }: { site: SiteConfig }) {
  return (
    <section className="customer-section contact-section" id="kontakt">
      <div>
        <p className="customer-eyebrow">Direkter Kontakt</p>
        <h2>Wie können wir helfen?</h2>
        <p>{site.profile.phone}</p>
        <p>{site.profile.email}</p>
        <p>{site.profile.address}</p>
      </div>
      <InquiryForm siteId={site.id} />
    </section>
  );
}

export function SiteTemplate({ site, page }: { site: SiteConfig; page?: string }) {
  const colors = palette[site.color];
  const origin = siteOrigin(site.slug);
  const style = {
    "--site-accent": colors.accent,
    "--site-dark": colors.dark,
    "--site-light": colors.light,
  } as CSSProperties;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.profile.name,
    description: site.profile.description,
    telephone: site.profile.phone,
    email: site.profile.email,
    address: site.profile.address,
    areaServed: site.profile.serviceArea,
    url: origin,
    sameAs: [site.profile.sourceUrl],
  };

  let pageContent: React.ReactNode = null;
  if (page === "leistungen") pageContent = <Services site={site} />;
  if (page === "ueber-uns") pageContent = <About site={site} />;
  if (page === "kontakt") pageContent = <Contact site={site} />;

  return (
    <div className={`customer-site template-${site.template}`} style={style}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {isWeekend() && <div className="weekend-banner">Auch am Wochenende erreichbar: Hey Telo nimmt Ihren Anruf entgegen.</div>}
      <header className="customer-header">
        <Link className="customer-logo" href={origin}>{site.profile.name}</Link>
        <nav>
          <Link href={origin}>Start</Link>
          {site.pages.map((item) => <Link key={item} href={`${origin}/${item}`}>{pageLabels[item]}</Link>)}
        </nav>
        <CallButton />
      </header>

      {pageContent || (
        <>
          <section className="customer-hero">
            <div>
              <p className="customer-eyebrow">{site.profile.trade} · {site.profile.serviceArea}</p>
              <h1>{site.profile.name}</h1>
              <p>{site.profile.description}</p>
              <div className="hero-actions"><CallButton /><a href="#kontakt">Anfrage senden</a></div>
            </div>
            <div className="hero-visual">
              {site.profile.imageUrls[0] ? <img src={site.profile.imageUrls[0]} alt={`${site.profile.trade} von ${site.profile.name}`} /> : <span>{site.profile.trade}</span>}
            </div>
          </section>
          {site.sections.includes("services") && <Services site={site} />}
          {site.sections.includes("about") && <About site={site} />}
          {site.sections.includes("area") && <Area site={site} />}
          {site.sections.includes("contact") && <Contact site={site} />}
        </>
      )}

      <footer className="customer-footer">
        <strong>{site.profile.name}</strong>
        <span>{site.profile.address}</span>
        <a href={`tel:${HEY_TELO_PHONE_NUMBER}`}>Anrufen</a>
      </footer>
      <CallButton floating />
    </div>
  );
}

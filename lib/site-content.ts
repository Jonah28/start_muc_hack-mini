import type {
  BusinessProfile,
  ServiceContent,
  SiteContent,
  SiteImageAsset,
  SitePageImages,
  ValueContent,
} from "@/lib/types";

type GeneratedCopy = {
  services: Omit<SiteContent["services"], "images">;
  about: Omit<SiteContent["about"], "images">;
  contact: Omit<SiteContent["contact"], "images">;
};

function image(id: string, alt: string, prompt: string): SiteImageAsset {
  return { id, alt, prompt };
}

function pageImages(profile: BusinessProfile): Record<keyof SiteContent, SitePageImages> {
  const context =
    `Authentische, hochwertige Werbefotografie für ${profile.name}, ` +
    `${profile.trade} in ${profile.serviceArea}. Keine Schrift, keine Logos, natürliches Licht.`;

  return {
    services: {
      hero: image(
        "services-hero",
        `${profile.trade} bei der fachgerechten Arbeit`,
        `${context} Ein erfahrener Handwerker führt ${profile.services[0] || "eine typische Arbeit"} präzise und professionell aus.`,
      ),
      feature: image(
        "services-process",
        `Werkzeug und Arbeitsprozess von ${profile.name}`,
        `${context} Detailaufnahme eines sauberen Arbeitsprozesses mit hochwertigem Werkzeug und sichtbarer handwerklicher Präzision.`,
      ),
    },
    about: {
      hero: image(
        "about-hero",
        `Das Team von ${profile.name}`,
        `${context} Sympathisches Teamfoto eines bodenständigen deutschen Handwerksbetriebs vor Werkstatt oder Firmenfahrzeug.`,
      ),
      feature: image(
        "about-workshop",
        `Einblick in den Betrieb ${profile.name}`,
        `${context} Authentischer Einblick in Werkstatt oder Arbeitsalltag, ordentlich, persönlich und vertrauenswürdig.`,
      ),
    },
    contact: {
      hero: image(
        "contact-hero",
        `${profile.name} ist in ${profile.serviceArea} erreichbar`,
        `${context} Freundlicher Handwerker im persönlichen Kundengespräch, aufmerksam, lösungsorientiert und nahbar.`,
      ),
      feature: image(
        "contact-area",
        `${profile.name} unterwegs im Einsatzgebiet`,
        `${context} Modernes neutrales Handwerkerfahrzeug auf dem Weg zu einem Kunden in ${profile.serviceArea}.`,
      ),
    },
  };
}

function serviceDescription(service: string, profile: BusinessProfile, index: number) {
  const endings = [
    "Wir beraten verständlich, planen sorgfältig und setzen fachgerecht um.",
    "Sie erhalten eine saubere Ausführung und einen festen Ansprechpartner.",
    "Von der ersten Anfrage bis zum fertigen Ergebnis arbeiten wir zuverlässig und transparent.",
  ];
  return `${service} für Privat- und Gewerbekunden in ${profile.serviceArea}. ${endings[index % endings.length]}`;
}

function fallbackCopy(profile: BusinessProfile): GeneratedCopy {
  const services: ServiceContent[] = profile.services.map((service, index) => ({
    name: service,
    description: serviceDescription(service, profile, index),
  }));
  const values: ValueContent[] = [
    {
      title: "Persönlich erreichbar",
      description: `Bei ${profile.name} haben Sie einen direkten Ansprechpartner für Ihr Anliegen.`,
    },
    {
      title: "Sauber ausgeführt",
      description: "Wir arbeiten sorgfältig, verbindlich und mit Blick auf ein dauerhaft gutes Ergebnis.",
    },
    {
      title: "In Ihrer Region",
      description: `Unser Team ist in ${profile.serviceArea} für Sie im Einsatz.`,
    },
  ];

  return {
    services: {
      eyebrow: `Leistungen in ${profile.serviceArea}`,
      title: `Gute Arbeit beginnt mit einer klaren Lösung.`,
      intro: `${profile.name} unterstützt Sie rund um ${profile.trade}. Wir hören genau zu, beraten verständlich und setzen Ihr Vorhaben fachgerecht um.`,
      services,
      processTitle: "So läuft Ihr Auftrag ab",
      processIntro: "Klare Absprachen und ein verlässlicher Ablauf sorgen dafür, dass Sie jederzeit wissen, wie es weitergeht.",
      processSteps: [
        "Sie schildern uns Ihr Anliegen telefonisch oder über das Anfrageformular.",
        "Wir klären die Anforderungen und besprechen die passende Lösung.",
        "Unser Team setzt die vereinbarten Arbeiten fachgerecht um.",
      ],
    },
    about: {
      eyebrow: `Ihr ${profile.trade} vor Ort`,
      title: `Handwerk, auf das Sie sich verlassen können.`,
      intro: `${profile.name} steht für persönliche Beratung, zuverlässige Absprachen und hochwertige Arbeit in ${profile.serviceArea}.`,
      paragraphs: [
        profile.description,
        `Jeder Auftrag ist anders. Deshalb nehmen wir uns Zeit, Ihre Anforderungen zu verstehen und eine Lösung zu finden, die zu Ihrem Vorhaben passt.`,
      ],
      values,
    },
    contact: {
      eyebrow: "Direkt und unkompliziert",
      title: "Lassen Sie uns über Ihr Vorhaben sprechen.",
      intro: `Ob erste Frage oder konkreter Auftrag: ${profile.name} ist für Sie erreichbar und meldet sich schnellstmöglich zurück.`,
      callbackText: "Rufen Sie direkt an oder hinterlassen Sie Ihre Kontaktdaten. Hey Telo nimmt Ihr Anliegen zuverlässig auf.",
      areaText: `Wir sind für Kundinnen und Kunden in ${profile.serviceArea} und Umgebung im Einsatz.`,
    },
  };
}

function extractOutputText(response: unknown) {
  if (!response || typeof response !== "object") return "";
  const body = response as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  if (body.output_text) return body.output_text;
  return (
    body.output
      ?.flatMap((item) => item.content || [])
      .find((content) => content.type === "output_text")?.text || ""
  );
}

function withImages(copy: GeneratedCopy, profile: BusinessProfile): SiteContent {
  const images = pageImages(profile);
  return {
    services: { ...copy.services, images: images.services },
    about: { ...copy.about, images: images.about },
    contact: { ...copy.contact, images: images.contact },
  };
}

export function createFallbackSiteContent(profile: BusinessProfile): SiteContent {
  return withImages(fallbackCopy(profile), profile);
}

export async function generateSiteContent(profile: BusinessProfile): Promise<SiteContent> {
  const fallback = fallbackCopy(profile);
  if (!process.env.OPENAI_API_KEY) return withImages(fallback, profile);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        input: [
          {
            role: "system",
            content:
              "Schreibe glaubwürdige, prägnante deutsche Website-Texte für einen Handwerksbetrieb. Erfinde keine Zertifikate, Bewertungen, Jahreszahlen oder Leistungen. Nutze ausschließlich die gelieferten Betriebsdaten. Texte sollen lokal, kundenorientiert und SEO-tauglich sein.",
          },
          {
            role: "user",
            content: JSON.stringify(profile),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "site_page_copy",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                services: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    eyebrow: { type: "string" },
                    title: { type: "string" },
                    intro: { type: "string" },
                    services: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          name: { type: "string" },
                          description: { type: "string" },
                        },
                        required: ["name", "description"],
                      },
                    },
                    processTitle: { type: "string" },
                    processIntro: { type: "string" },
                    processSteps: { type: "array", items: { type: "string" } },
                  },
                  required: ["eyebrow", "title", "intro", "services", "processTitle", "processIntro", "processSteps"],
                },
                about: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    eyebrow: { type: "string" },
                    title: { type: "string" },
                    intro: { type: "string" },
                    paragraphs: { type: "array", items: { type: "string" } },
                    values: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                        },
                        required: ["title", "description"],
                      },
                    },
                  },
                  required: ["eyebrow", "title", "intro", "paragraphs", "values"],
                },
                contact: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    eyebrow: { type: "string" },
                    title: { type: "string" },
                    intro: { type: "string" },
                    callbackText: { type: "string" },
                    areaText: { type: "string" },
                  },
                  required: ["eyebrow", "title", "intro", "callbackText", "areaText"],
                },
              },
              required: ["services", "about", "contact"],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) throw new Error(`OpenAI API antwortete mit ${response.status}.`);
    const generated = JSON.parse(extractOutputText(await response.json())) as GeneratedCopy;
    return withImages(generated, profile);
  } catch (error) {
    console.error("Page copy generation failed, using fallback:", error);
    return withImages(fallback, profile);
  }
}

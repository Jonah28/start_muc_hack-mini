# Werkseite

Aus einer bestehenden Handwerker-Website wird in wenigen Klicks eine moderne,
öffentlich erreichbare Website unter einer eigenen Subdomain.

## Lokal starten

```bash
cp .env.example .env.local
npm install
npm run dev
```

Generator: `http://localhost:3333`

Generierte Website: `http://<slug>.localhost:3333`

Ohne `OPENAI_API_KEY` nutzt die Extraktion automatisch die regelbasierte
Fallback-Logik. Ein Codex-Zugang ist kein OpenAI-API-Key.

## Coolify-Deployment

1. In Cloudflare zwei DNS-Einträge als **DNS only** anlegen:
   - `A @` → öffentliche VPS-IP
   - `A *` → öffentliche VPS-IP
2. In Coolify eine neue Anwendung aus `Jonah28/start_muc_hack-mini`, Branch
   `main`, erstellen und das `Dockerfile` als Build-Pack wählen.
3. Port `3333` exponieren und ein persistentes Volume nach `/app/data` mounten.
4. Die Domains `https://werkseite.org` und `https://*.werkseite.org` hinterlegen.
5. Für ein Wildcard-Zertifikat Coolifys Traefik DNS-Challenge mit einem
   Cloudflare-Token konfigurieren. Der Token benötigt für `werkseite.org`
   mindestens `Zone:Read` und `DNS:Edit`.

### Environment-Variablen

```env
ROOT_DOMAIN=werkseite.org
DATA_DIR=/app/data
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
HEY_TELO_PHONE_NUMBER=+491234567890
HEY_TELO_WEBHOOK_URL=
```

`HEY_TELO_WEBHOOK_URL` ist optional. Ist sie gesetzt, wird jede Anfrage nach
dem Speichern an diesen Endpunkt gesendet.

## Design-Übergabe

- Die bestehende Generator-Landingpage liegt in `app/page.tsx` und
  `components/ui/animated-hero.tsx`.
- Die Kundenwebsite liegt in `components/SiteTemplate.tsx`.
- Alle Styles stehen in `app/globals.css` und sind über die Präfixe
  `.landing-*`, `.generator-*` und `.customer-*` getrennt.
- Die Datenverträge für neue Designs stehen in `lib/types.ts`.

## SEO

Jede Kundenwebsite startet mit `noindex`. Nach Aktivierung des
SEO-Publish-Schalters werden Meta-Robots, `robots.txt`, `sitemap.xml`,
Canonical-URLs, Open Graph und strukturierte Local-Business-Daten freigegeben.

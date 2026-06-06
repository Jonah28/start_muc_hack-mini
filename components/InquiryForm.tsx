"use client";

import { FormEvent, useState } from "react";

export function InquiryForm({ siteId }: { siteId: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, ...Object.fromEntries(form.entries()) }),
    });
    if (response.ok) setSent(true);
    else setError("Die Anfrage konnte nicht gesendet werden.");
  }

  if (sent) return <p className="inquiry-success">Vielen Dank. Wir melden uns schnellstmöglich.</p>;

  return (
    <form className="inquiry-form" onSubmit={submit}>
      <div className="field-row">
        <label>Name<input name="name" required /></label>
        <label>Telefon<input name="phone" type="tel" required /></label>
      </div>
      <label>E-Mail<input name="email" type="email" /></label>
      <label>Ihre Anfrage<textarea name="message" required rows={4} /></label>
      <button type="submit">Anfrage senden</button>
      {error && <p>{error}</p>}
    </form>
  );
}

"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors hover:cursor-pointer ${
        checked ? "bg-[#38A169]" : "bg-black/15"
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-1/2 inline-block h-5 w-5 -translate-y-1/2 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function PasswordInput({
  defaultValue,
  label,
}: {
  defaultValue: string;
  label: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        defaultValue={defaultValue}
        aria-label={label}
        className="h-10 w-full rounded-lg border border-black/10 bg-white pl-3 pr-10 text-[12px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Nascondi" : "Mostra"}
        className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#9aa39a] hover:cursor-pointer hover:bg-black/5 hover:text-[#1f2b20]"
      >
        {show ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-black/10 bg-white px-4 py-4">
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-[#1f2b20]">{title}</div>
        <div className="mt-1 text-[11px] font-medium text-[#6b746c]">
          {description}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function ActiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#38A169]">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#38A169]" />
      Attivo
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium text-[#6b746c]">{children}</span>
  );
}

function TextInput({
  defaultValue,
  label,
}: {
  defaultValue: string;
  label: string;
}) {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      aria-label={label}
      className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-[12px] font-medium text-[#1f2b20] outline-none focus:border-[#5DBE54] focus:ring-2 focus:ring-[#5DBE54]/15"
    />
  );
}

export function ProviderApiContent() {
  const [klarnaInstalments, setKlarnaInstalments] = useState(true);
  const [klarnaAutoPayout, setKlarnaAutoPayout] = useState(true);
  const [stripeAutoPayout, setStripeAutoPayout] = useState(true);

  return (
    <div className="space-y-6 px-6 py-6">
      <section>
        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
            KLARNA
          </div>
          <ActiveBadge />
        </div>
        <p className="mt-2 max-w-3xl text-[11px] font-medium text-[#6b746c]">
          Configura le credenziali API e le impostazioni per l&apos;integrazione
          Klarna. Klarna gestisce i pagamenti rateali per i clienti finali del
          marketplace.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <label className="block">
            <FieldLabel>Ambiente</FieldLabel>
            <div className="mt-1">
              <TextInput defaultValue="Produzione (Live)" label="Ambiente" />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Regione API</FieldLabel>
            <div className="mt-1">
              <TextInput defaultValue="EU (Europa)" label="Regione API" />
            </div>
          </label>
        </div>

        <div className="mt-4 space-y-4">
          <label className="block">
            <FieldLabel>Username API</FieldLabel>
            <div className="mt-1">
              <TextInput
                defaultValue="K123456_abc123def456"
                label="Username API"
              />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Password API</FieldLabel>
            <div className="mt-1">
              <PasswordInput
                defaultValue="supersecret_klarna_password_123"
                label="Password API"
              />
            </div>
          </label>
        </div>

        <div className="mt-5 space-y-3">
          <ToggleRow
            title="Abilita pagamenti rateali"
            description="Permetti ai clienti di pagare a rate senza interessi tramite Klarna."
            checked={klarnaInstalments}
            onChange={setKlarnaInstalments}
          />
          <ToggleRow
            title="Payout automatici"
            description="Klarna gestisce i payout automatici ai venditori."
            checked={klarnaAutoPayout}
            onChange={setKlarnaAutoPayout}
          />
        </div>

        <button
          type="button"
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#214e3a] px-3 text-[12px] font-semibold text-white hover:cursor-pointer hover:bg-[#1a3f2e]"
        >
          Apri dashboard Klarna
        </button>
      </section>

      <div className="h-px w-full bg-black/10" />

      <section>
        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px] font-semibold tracking-wide text-[#1f2b20]">
            STRIPE CONNECT
          </div>
          <ActiveBadge />
        </div>
        <p className="mt-2 max-w-3xl text-[11px] font-medium text-[#6b746c]">
          Stripe Connect gestisce i pagamenti verso i venditori del
          marketplace. Ogni venditore ha un account Connect collegato.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <label className="block">
            <FieldLabel>Tipo Account</FieldLabel>
            <div className="mt-1">
              <TextInput defaultValue="Express" label="Tipo Account" />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Paese Default</FieldLabel>
            <div className="mt-1">
              <TextInput defaultValue="Italia (IT)" label="Paese Default" />
            </div>
          </label>
        </div>

        <div className="mt-4 space-y-4">
          <label className="block">
            <FieldLabel>Publishable Key</FieldLabel>
            <div className="mt-1">
              <TextInput
                defaultValue="pk_live_51AbCdEfGhIjKlMnOpQrStUvWxYz"
                label="Publishable Key"
              />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Secret Key</FieldLabel>
            <div className="mt-1">
              <PasswordInput
                defaultValue="sk_live_51AbCdEfGhIjKlMnOpQr"
                label="Secret Key"
              />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Webhook Secret</FieldLabel>
            <div className="mt-1">
              <PasswordInput
                defaultValue="whsec_supersecret_webhook_value"
                label="Webhook Secret"
              />
            </div>
          </label>
        </div>

        <div className="mt-5 space-y-3">
          <ToggleRow
            title="Payout automatici"
            description="Stripe gestisce i payout automatici ai venditori."
            checked={stripeAutoPayout}
            onChange={setStripeAutoPayout}
          />
        </div>

        <button
          type="button"
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#214e3a] px-3 text-[12px] font-semibold text-white hover:cursor-pointer hover:bg-[#1a3f2e]"
        >
          Apri dashboard Stripe
        </button>
      </section>
    </div>
  );
}

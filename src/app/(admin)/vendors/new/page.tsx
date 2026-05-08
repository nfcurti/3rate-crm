"use client";

import {
  ChevronRight,
  Eye,
  FileText,
  Search,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Topbar } from "@/components/layout/Topbar";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="px-6 py-4">
        <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
          {title}
        </div>
      </div>
      <div className="h-px w-full bg-black/5" />
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  required,
  rightIcon,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold text-[#6b746c]">
        {label}
        {required ? <span className="text-[#ef4444]"> *</span> : null}
      </div>
      <div className="relative">
        <input
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
        />
        {rightIcon ? (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa39a]">
            {rightIcon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Pill({
  children,
  tone = "green",
}: {
  children: React.ReactNode;
  tone?: "green" | "gray";
}) {
  const cls =
    tone === "green"
      ? "bg-[#e7f6ea] text-[#38A169]"
      : "bg-[#f2f4f2] text-[#6b746c]";
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function UploadCard({
  title,
  subtitle,
  accept = "application/pdf,image/png,image/jpeg",
  maxSizeMB = 10,
  onChange,
}: {
  title: string;
  subtitle: string;
  accept?: string;
  maxSizeMB?: number;
  onChange?: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function processFile(f: File) {
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`Il file supera ${maxSizeMB}MB`);
      setFile(null);
      onChange?.(null);
      return;
    }
    setError(null);
    setFile(f);
    onChange?.(f);
  }

  function handleSelect() {
    inputRef.current?.click();
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }

  function handleRemove() {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange?.(null);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }
  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
  }
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl border border-dashed p-4 transition-colors ${
        dragOver
          ? "border-[#5DBE54] bg-[#e7f6ea]"
          : "border-black/15 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f2f4f2] text-[#6b746c]">
          <Upload className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-[#1f2b20]">{title}</div>
          <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
            {subtitle}
          </div>

          {file ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#5DBE54]/30 bg-[#e7f6ea] px-3 py-2">
              <FileText className="h-3.5 w-3.5 flex-none text-[#38A169]" />
              <div className="min-w-0 flex-1 truncate text-[11px] font-medium text-[#1f5132]">
                {file.name}
              </div>
              <span className="flex-none text-[10px] font-medium text-[#6b746c]">
                {formatBytes(file.size)}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                aria-label="Rimuovi file"
                className="inline-flex h-5 w-5 flex-none items-center justify-center rounded text-[#6b746c] hover:cursor-pointer hover:bg-black/10"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}

          {error ? (
            <div className="mt-2 text-[10px] font-semibold text-[#E53E3E]">
              {error}
            </div>
          ) : null}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleInputChange}
          />

          <button
            type="button"
            onClick={handleSelect}
            className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-[11px] font-semibold text-[#1f2b20] hover:cursor-pointer hover:bg-black/5"
          >
            {file ? "Cambia file" : "Scegli file"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewVendorPage() {
  const [showPwd, setShowPwd] = useState(false);

  const products = useMemo(
    () => [
      { name: "Smartphone X Pro 128GB", sku: "SP-XPRO-128", price: "€ 899.00", qty: "0" },
      { name: "Laptop Ultrabook 14”", sku: "LP-UL-14", price: "€ 1,299.00", qty: "0" },
      { name: "Cuffie Wireless Noise Cancelling", sku: "HP-WH-NC", price: "€ 249.00", qty: "0" },
      { name: "Smartwatch Series 5 Sport", sku: "SW-S5-BLK", price: "€ 199.00", qty: "0" },
      { name: "Tablet Pro 11 WiFi", sku: "TB-P11-WF", price: "€ 499.00", qty: "0" },
    ],
    [],
  );

  return (
    <>
      <Topbar
        title=""
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link href="/vendors" className="hover:cursor-pointer hover:underline">
              Venditori
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#6b746c]">Aggiungi Venditore</span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-4xl px-6 py-6">
        <div className="mb-5">
          <div className="mt-1 text-[11px] font-medium text-[#9aa39a]">
            Inserisci i dati per registrare manualmente un nuovo venditore nel marketplace.
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard title="DATI AZIENDALI">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field label="Ragione Sociale" required placeholder="Es. Tech Store Milano Srl" />
              <Field label="Partita IVA" required placeholder="IT01234567890" />
              <Field label="Codice Fiscale (se diverso da P.IVA)" placeholder="Codice fiscale" />
              <Field label="Codice SDI" placeholder="XXXXXXX" />
            </div>
          </SectionCard>

          <SectionCard title="CONTATTI">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Field label="Email Principale" required placeholder="email@azienda.it" />
              <Field label="PEC" required placeholder="pec@azienda.it" />
              <Field label="Telefono" placeholder="+39 02 1234567" />
              <Field label="Whatsapp Business" placeholder="+39 333 0000000" />
              <div className="lg:col-span-2">
                <Field label="Indirizzo" placeholder="Via Roma, 1" />
              </div>
              <Field label="CAP" placeholder="20100" />
              <Field label="Città" placeholder="Milano" />
              <Field
                label="Provincia"
                placeholder="Seleziona Provincia"
                rightIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </SectionCard>

          <SectionCard title="CATEGORIE">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field label="Categoria prodotto" required placeholder="Elettronica" />
                <div className="rounded-lg flex justify-center bg-white mt-4">
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    <span className="m-2">
                      <Pill>Hardware</Pill>
                    </span>
                    <span className="m-2">
                      <Pill>Smartphone</Pill>
                    </span>
                    <span className="m-2">
                      <Pill>Computer</Pill>
                    </span>
                    <span className="m-2">
                      <Pill tone="gray">Internet</Pill>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-[#6b746c]">
                  Descrizione negozio
                </div>
                <textarea
                  placeholder="Breve descrizione del venditore e dei prodotti offerti..."
                  className="mt-2 min-h-[90px] w-full rounded-lg border border-black/10 bg-white px-3 py-3 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
                />
              </div>

              <div className="rounded-xl border border-black/10 bg-white">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="text-[10px] font-semibold tracking-wide text-[#6b746c]">
                    Prodotti attivi di categoria Elettronica
                  </div>
                </div>
                <div className="h-px w-full bg-black/5" />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-[#f6f7f6] text-[10px] font-semibold tracking-wide text-[#9aa39a]">
                      <tr className="border-b border-black/5">
                        <th className="w-[44px] px-5 py-3">IMG</th>
                        <th className="py-3 pr-4">PRODOTTO</th>
                        <th className="py-3 pr-4">SKU</th>
                        <th className="py-3 pr-4 text-right">PREZZO</th>
                        <th className="px-5 py-3 text-right">QUANTITÀ</th>
                      </tr>
                    </thead>
                    <tbody className="text-[12px] text-[#1f2b20]">
                      {products.map((p) => (
                        <tr
                          key={p.sku}
                          className="border-b border-black/5 transition-colors hover:bg-black/[0.02]"
                        >
                          <td className="px-5 py-4">
                            <div className="h-8 w-8 rounded-lg bg-[#f2f4f2] ring-1 ring-black/5" />
                          </td>
                          <td className="py-4 pr-4 text-[11px] font-semibold">{p.name}</td>
                          <td className="py-4 pr-4 text-[11px] font-semibold text-[#6b746c]">
                            {p.sku}
                          </td>
                          <td className="py-4 pr-4 text-right text-[11px] font-semibold">
                            {p.price}
                          </td>
                          <td className="px-5 py-4 text-right text-[11px] font-semibold text-[#6b746c]">
                            {p.qty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="COMMISSIONI">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Field label="Piano commissioni" required placeholder="Standard (3%)" />
              <Field label="Commissione base (%)" required placeholder="3.0" />
              <Field label="Scadenza payout" required placeholder="Settimanal (7 gg)" />
            </div>
          </SectionCard>

          <SectionCard title="DETTAGLI PAYOUT">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <Field label="Intestatario Conto" required placeholder="Nome intestatario" />
              </div>
              <div className="lg:col-span-2">
                <Field label="IBAN" required placeholder="IT00 A000 0000 0000 0000 0000 000" />
              </div>
              <Field label="Banca / Provider" placeholder="Es. Intesa Sanpaolo" />
              <Field label="BIC/SWIFT (se estero)" placeholder="BIC/SWIFT" />
            </div>
          </SectionCard>

          <SectionCard title="DOCUMENTI">
            <div className="text-[11px] font-medium text-[#9aa39a]">
              Carica documenti necessari per la verifica del venditore (opzionale).
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <UploadCard
                title="Visura Camerale"
                subtitle="PDF, PNG, JPG • Max 10MB"
              />
              <UploadCard
                title="Documento identità Legale Rapp"
                subtitle="PDF, PNG, JPG • Max 10MB"
              />
            </div>
          </SectionCard>

          <SectionCard title="CREDENZIALI ACCESS VENDITORE">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field label="Email di accesso" required placeholder="login@azienda.it" />
              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-[#6b746c]">
                  Password provvisoria <span className="text-[#ef4444]">*</span>
                </div>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Genera automaticamente"
                    className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 pr-10 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9aa39a] hover:cursor-pointer hover:bg-black/5"
                    aria-label="Mostra password"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <label className="mt-4 flex items-start gap-3 text-[11px] font-medium text-[#6b746c]">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-black/10" />
              Invia email al venditore con le credenziali (logo+personalizzato)
            </label>
          </SectionCard>

          <div className="sticky bottom-0 -mx-6 mt-2 border-t border-black/5 bg-[#f3f5f2] px-6 py-4">
            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#214e3a] text-[12px] font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-[#1a3f2e] active:translate-y-px"
            >
              <ShieldCheck className="h-4 w-4" />
              Salva e aggiungi nuovo venditore
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


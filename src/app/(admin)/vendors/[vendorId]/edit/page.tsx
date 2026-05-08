"use client";

import { ChevronRight, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { getVendorDemoById } from "@/lib/vendors-demo";

function SectionCard({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div className="text-[11px] font-semibold tracking-wide text-[#1f2b20]">
          {title}
        </div>
        {right}
      </div>
      <div className="h-px w-full bg-black/5" />
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold text-[#6b746c]">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
      />
    </div>
  );
}

export default function EditVendorCompanyContactsPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = use(params);
  const vendor = useMemo(() => getVendorDemoById(vendorId), [vendorId]);
  const router = useRouter();

  const [companyName, setCompanyName] = useState(vendor?.name ?? "Tech Store Milano Srl");
  const [vat, setVat] = useState(vendor?.vat ? `IT${vendor.vat}` : "IT01234567890");
  const [fiscalCode, setFiscalCode] = useState(vendor?.vat ? `IT${vendor.vat}` : "IT01234567890");
  const [sdi, setSdi] = useState("M5UXCR1");

  const [email, setEmail] = useState(
    vendor?.email ?? "amministrazione@techstoremilano.it",
  );
  const [pec, setPec] = useState(vendor?.email ?? "amministrazione@techstoremilano.it");
  const [phone, setPhone] = useState(vendor?.phone ?? "+12 345 678 910");
  const [whatsapp, setWhatsapp] = useState(vendor?.phone ?? "+12 345 678 910");

  const [address, setAddress] = useState("Via Roma 123");
  const [city, setCity] = useState("Milano");
  const [cap, setCap] = useState("20100");
  const [province, setProvince] = useState("Milano (MI)");

  function handleSave() {
    // TODO: wire to real API
    void companyName;
    void vat;
    void fiscalCode;
    void sdi;
    void email;
    void pec;
    void phone;
    void whatsapp;
    void address;
    void city;
    void cap;
    void province;
    router.push(`/vendors/${encodeURIComponent(vendorId)}`);
  }

  return (
    <>
      <Topbar
        title={null}
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link href="/vendors" className="hover:cursor-pointer hover:underline">
              Venditori
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/vendors/${encodeURIComponent(vendorId)}`}
              className="hover:cursor-pointer hover:underline"
            >
              Profilo Venditore
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#6b746c]">Modifica dati</span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-4xl px-6 py-6">
        <div className="space-y-4">
          <SectionCard
            title="DATI AZIENDALI"
            right={
              <Link
                href={`/vendors/${encodeURIComponent(vendorId)}`}
                className="text-[11px] font-semibold text-[#6b746c] hover:cursor-pointer hover:underline"
              >
                Annulla
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field label="Ragione Sociale" value={companyName} onChange={setCompanyName} />
              <Field
                label="Partita IVA"
                value={vat}
                onChange={setVat}
                placeholder="IT01234567890"
              />
              <Field
                label="C.F."
                value={fiscalCode}
                onChange={setFiscalCode}
                placeholder="Codice fiscale"
              />
              <Field label="Codice SDI" value={sdi} onChange={setSdi} placeholder="XXXXXXX" />
            </div>
          </SectionCard>

          <SectionCard title="CONTATTI">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Field label="Email Principale" value={email} onChange={setEmail} />
              <Field label="PEC" value={pec} onChange={setPec} />
              <Field label="Telefono" value={phone} onChange={setPhone} />
              <Field label="Whatsapp Business" value={whatsapp} onChange={setWhatsapp} />
              <div className="lg:col-span-2">
                <Field label="Indirizzo" value={address} onChange={setAddress} />
              </div>
              <Field label="CAP" value={cap} onChange={setCap} />
              <Field label="Città" value={city} onChange={setCity} />
              <Field label="Provincia" value={province} onChange={setProvince} />
            </div>
          </SectionCard>

          <div className="sticky bottom-0 -mx-6 border-t border-black/5 bg-[#f3f5f2] px-6 py-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#214e3a] text-[12px] font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-[#1a3f2e] active:translate-y-px"
            >
              <Save className="h-4 w-4" />
              Salva modifiche
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


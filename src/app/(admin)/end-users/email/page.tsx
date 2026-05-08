"use client";

import { ChevronRight, FileText, X } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Topbar } from "@/components/layout/Topbar";
import { useEndUserSelection } from "@/components/end-users/EndUserSelectionProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ATTACHMENT_ACCEPT =
  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const MAX_ATTACHMENT_MB = 10;

type Attachment = {
  id: string;
  name: string;
  size: number;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const inter = Inter({
  subsets: ["latin"],
});

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
  disabled,
  value,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold text-[#6b746c]">
        {label}
        {required ? <span className="text-[#ef4444]"> *</span> : null}
      </div>
      <input
        disabled={disabled}
        defaultValue={value}
        placeholder={placeholder}
        className={`h-10 w-full rounded-lg border border-black/10 px-3 text-[12px] font-medium outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15 ${
          disabled ? "bg-[#f6f7f6] text-[#6b746c]" : "bg-white text-[#1f2b20]"
        }`}
      />
    </div>
  );
}

function RecipientChip({
  initials,
  name,
  email,
}: {
  initials: string;
  name: string;
  email: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f6f7f6] px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f4f2] text-[11px] font-semibold text-[#6b746c] ring-1 ring-black/5">
        {initials}
      </div>
      <div className="min-w-0">
        <div className="truncate text-[11px] font-semibold text-[#1f2b20]">
          {name}
        </div>
        <div className="truncate text-[10px] font-medium text-[#9aa39a]">
          {email}
        </div>
      </div>
    </div>
  );
}

function AttachmentRow({
  name,
  size,
  onRemove,
}: {
  name: string;
  size: string;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#f2f4f2] text-[#6b746c]">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold text-[#1f2b20]">
            {name}
          </div>
          <div className="mt-0.5 text-[10px] font-medium text-[#9aa39a]">
            {size}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg text-[#9aa39a] hover:cursor-pointer hover:bg-black/5"
        aria-label={`Rimuovi allegato ${name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function EndUsersBulkEmailPage() {
  return (
    <Suspense fallback={null}>
      <EndUsersEmailPageInner />
    </Suspense>
  );
}

function EndUsersEmailPageInner() {
  const { selectedById } = useEndUserSelection();
  const searchParams = useSearchParams();
  const singleUserEmail = searchParams.get("to");
  const singleUserName = searchParams.get("name");
  const isSingleUser = Boolean(singleUserEmail);

  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "demo-1", name: "Linee_Guida_Vendite.docx", size: 1.8 * 1024 * 1024 },
    { id: "demo-2", name: "Tariffe_Commissioni.xlsx", size: 856 * 1024 },
  ]);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [attachmentDragOver, setAttachmentDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function processFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const tooLarge: string[] = [];
    const accepted: Attachment[] = [];

    files.forEach((f) => {
      if (f.size > MAX_ATTACHMENT_MB * 1024 * 1024) {
        tooLarge.push(f.name);
        return;
      }
      accepted.push({
        id: `${f.name}-${f.size}-${f.lastModified}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
        name: f.name,
        size: f.size,
      });
    });

    if (accepted.length > 0) {
      setAttachments((prev) => [...prev, ...accepted]);
    }
    setAttachmentError(
      tooLarge.length > 0
        ? `Alcuni file superano ${MAX_ATTACHMENT_MB}MB: ${tooLarge.join(", ")}`
        : null,
    );
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  }

  function handleDragOver(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setAttachmentDragOver(true);
  }
  function handleDragLeave(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setAttachmentDragOver(false);
  }
  function handleDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setAttachmentDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  const recipients = useMemo(
    () => [
      { initials: "MR", name: "Maria Rossi", email: "maria.rossi@email.it" },
      { initials: "LB", name: "Luca Bianchi", email: "luca.bianchi@email.it" },
      { initials: "GV", name: "Giulia Verdi", email: "giulia.verdi@email.it" },
      { initials: "MC", name: "Marco Conti", email: "marco.conti@email.it" },
      { initials: "AR", name: "Andrea Russo", email: "andrea.russo@email.it" },
      { initials: "SF", name: "Sofia Ferrari", email: "sofia.ferrari@email.it" },
    ],
    [],
  );

  const selectedRecipients = useMemo(() => {
    const rows = Array.from(selectedById.values());
    if (rows.length === 0) return recipients;
    return rows.map((r) => ({
      initials: r.name
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase(),
      name: r.name,
      email: r.email,
    }));
  }, [recipients, selectedById]);

  const tooltipRecipients = useMemo(
    () => selectedRecipients.slice(0, 4),
    [selectedRecipients],
  );
  const tooltipRemaining = Math.max(
    0,
    selectedRecipients.length - tooltipRecipients.length,
  );

  return (
    <>
      <Topbar
        title={null}
        breadcrumb={
          <span className="inline-flex items-center gap-2">
            <Link href="/end-users" className="hover:cursor-pointer hover:underline">
              Utenti
            </Link>
            <ChevronRight className="h-4 w-4" />
            {isSingleUser && singleUserName ? (
              <>
                <span className="text-[#6b746c]">{singleUserName}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#6b746c]">Invia email</span>
              </>
            ) : (
              <span className="text-[#6b746c]">Invia email di massa</span>
            )}
          </span>
        }
      />

      <div className={`mx-auto w-full max-w-6xl px-6 py-6 ${inter.className}`}>
        <div className="space-y-4">
          {isSingleUser ? null : (
            <SectionCard title="DESTINATARI SELEZIONATI">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {selectedRecipients.slice(0, 6).map((r) => (
                  <RecipientChip key={r.email} {...r} />
                ))}

                <TooltipProvider>
                  <Tooltip delayDuration={120}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center rounded-xl border border-dashed border-black/15 bg-white px-4 py-3 text-[11px] font-semibold text-[#6b746c] hover:cursor-pointer">
                        +1 altri
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      <div className="flex flex-col gap-1">
                        {tooltipRecipients.map((u) => (
                          <div key={u.email} className="leading-tight">
                            <div className="font-semibold">{u.name}</div>
                            <div className="text-[10px] font-medium text-[#9aa39a]">
                              {u.email}
                            </div>
                          </div>
                        ))}
                        {tooltipRemaining > 0 ? (
                          <div className="leading-tight text-[11px] font-semibold text-[#6b746c]">
                            +{tooltipRemaining} altre
                          </div>
                        ) : null}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Link
                  href="/end-users/email/recipients"
                  className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#214e3a] px-4 text-[12px] font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-[#1a3f2e]"
                >
                  Modifica selezione
                </Link>
              </div>
            </SectionCard>
          )}

          <SectionCard title="COMPONI EMAIL">
            <div className="space-y-4">
              <Field label="Mittente" disabled value="noreply@3rate.com" />
              {isSingleUser && singleUserEmail ? (
                <Field
                  key={singleUserEmail}
                  label="Destinatario"
                  disabled
                  value={singleUserEmail}
                />
              ) : null}
              <Field
                label="Oggetto email"
                required
                placeholder="Es: Novità per i tuoi ordini su 3rate..."
              />

              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-[#6b746c]">
                  Testo del messaggio <span className="text-[#ef4444]">*</span>
                </div>
                <textarea
                  placeholder="Scrivi qui il tuo messaggio..."
                  className="min-h-[240px] w-full rounded-lg border border-black/10 bg-white px-3 py-3 text-[12px] font-medium text-[#1f2b20] outline-none placeholder:text-[#c0c6c0] focus:border-[#5DBE54] focus:ring-4 focus:ring-[#5DBE54]/15"
                />
                <div className="text-[10px] font-medium text-[#9aa39a]">
                  Puoi usare variabili: {"{nome}"}, {"{cognome}"}, {"{email}"},{" "}
                  {"{id_utente}"}
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] font-semibold text-[#6b746c]">
                  Allegati
                </div>
                <div className="mt-3 space-y-3">
                  {attachments.map((a) => (
                    <AttachmentRow
                      key={a.id}
                      name={a.name}
                      size={formatBytes(a.size)}
                      onRemove={() => removeAttachment(a.id)}
                    />
                  ))}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ATTACHMENT_ACCEPT}
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-8 text-center transition-colors hover:cursor-pointer ${
                      attachmentDragOver
                        ? "border-[#5DBE54] bg-[#e7f6ea]"
                        : "border-black/15 bg-white hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-[#1f2b20]">
                      Aggiungi altro allegato
                    </div>
                    <div className="text-[10px] font-medium text-[#9aa39a]">
                      PDF, DOC, DOCX, XLS, XLSX (max {MAX_ATTACHMENT_MB}MB)
                    </div>
                  </button>

                  {attachmentError ? (
                    <div className="text-[10px] font-semibold text-[#E53E3E]">
                      {attachmentError}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="sticky bottom-0 -mx-6 border-t border-black/5 bg-[#f3f5f2] px-6 py-4">
            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#214e3a] text-[12px] font-semibold text-white shadow-sm hover:cursor-pointer hover:bg-[#1a3f2e] active:translate-y-px"
            >
              Invia email
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


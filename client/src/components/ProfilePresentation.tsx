/** Signal Atlas style note: the presentation is an editorial identity rail, structured for immediate one-hand contact actions. */
import { ArrowUpRight, Copy, Download, ExternalLink, Share2 } from "lucide-react";
import type { CSSProperties } from "react";
import { toast } from "sonner";
import { BrandMark } from "@/components/BrandMark";
import { LinkIcon } from "@/components/LinkIcon";
import { getLinkHref, type Profile } from "@/lib/profile-store";

const heroAsset = "/manus-storage/signal-atlas-hero_ec06af89.jpg";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ProfilePresentation({ profile, embedded = false }: { profile: Profile; embedded?: boolean }) {
  const links = profile.links.filter((link) => link.visible);
  const style = { "--signal": profile.accentColor || "#2457F5" } as CSSProperties;

  const copyProfileUrl = async () => {
    const url = `${window.location.origin}/${profile.slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Profile link copied");
  };

  const downloadContact = () => {
    const phone = profile.links.find((link) => link.kind === "phone")?.value || "";
    const vcf = ["BEGIN:VCARD", "VERSION:3.0", `FN:${profile.name}`, `TITLE:${profile.role}`, `EMAIL:${profile.email}`, phone ? `TEL:${phone}` : "", `URL:${window.location.origin}/${profile.slug}`, "END:VCARD"].filter(Boolean).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([vcf], { type: "text/vcard" }));
    link.download = `${profile.slug}-contact.vcf`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Contact card downloaded");
  };

  return (
    <div className={embedded ? "profile-preview" : "min-h-screen bg-[#F7F5F1] text-[#151716]"} style={style}>
      <div className={embedded ? "relative overflow-hidden rounded-[1.55rem] border border-black/10 bg-[#F7F5F1] text-[#151716] shadow-[0_24px_50px_rgba(25,28,27,.12)]" : "relative isolate overflow-hidden"}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] overflow-hidden border-b border-black/5">
          <img src={heroAsset} alt="" className="h-full w-full object-cover object-center opacity-75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F1]/30 via-[#F7F5F1]/65 to-[#F7F5F1]" />
        </div>

        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 pb-8 pt-6 sm:px-8 lg:px-10">
          <a href="/" className="group flex items-center gap-3" aria-label="Open profile home">
            <BrandMark className="h-9 w-9 rounded-full bg-[var(--signal)] p-1" />
            <div className="leading-none">
              <p className="font-mono text-[9px] font-medium uppercase tracking-[0.24em] text-black/45">NFC identity</p>
              <div className="mt-1.5 flex items-center gap-1.5"><span className="h-[3px] w-4 bg-[var(--signal)]" /><p className="text-sm font-extrabold tracking-[-0.055em]">SIGNAL<span className="ml-1 font-mono text-[9px] font-medium tracking-[0.16em]">ATLAS</span></p></div>
            </div>
          </a>
          <button onClick={copyProfileUrl} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.11em] transition hover:border-black/25 hover:bg-white active:scale-[0.97]" aria-label="Copy profile link">
            <Share2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Share</span>
          </button>
        </header>

        <main className="relative mx-auto max-w-6xl px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
          <section className="grid gap-9 lg:grid-cols-[0.78fr_1.45fr] lg:gap-16">
            <aside className="lg:pt-7">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">
                <span className="h-px w-7 bg-black/35" /> 01 / Identity
              </div>
              <div className="mt-6 flex items-end gap-5 lg:block">
                <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full border-[5px] border-[#F7F5F1] bg-[#1A1D1B] text-3xl font-extrabold tracking-[-0.08em] text-white shadow-[0_0_0_1px_rgba(21,23,22,.17),0_16px_32px_rgba(21,23,22,.16)] lg:h-36 lg:w-36 lg:text-5xl">
                  {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full rounded-full object-cover" /> : profile.monogram || initials(profile.name)}
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-[#F7F5F1] bg-[var(--signal)]" />
                </div>
                <p className="max-w-[15rem] pb-1 text-sm leading-6 text-black/58 lg:mt-7 lg:pb-0">A tap-ready route to the people, work, and conversation that matter.</p>
              </div>
              <div className="mt-7 hidden items-center gap-3 lg:flex">
                <span className="font-mono text-[10px] text-black/42">STATUS</span>
                <span className="h-2 w-2 rounded-full bg-[var(--signal)]" />
                <span className="text-xs font-bold">Available to connect</span>
              </div>
            </aside>

            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--signal)]">Independent profile / {profile.slug}</p>
              <h1 className="profile-name mt-3 max-w-3xl text-[clamp(2.75rem,8vw,6.8rem)] font-extrabold leading-[0.9] tracking-[-0.075em] text-[#151716]" style={{ fontSize: "70px" }}>{profile.name}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm font-extrabold uppercase tracking-[0.13em] text-[#151716]">{profile.role}</p>
                <span className="hidden h-1 w-1 rounded-full bg-black/25 sm:block" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/42">Scan / Tap / Connect</span>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-7 text-black/66 sm:text-lg sm:leading-8">{profile.bio}</p>
              <div className="mt-5 flex items-center gap-3"><span className="h-[3px] w-12 bg-[var(--signal)]" /><span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-black/42">Direct path / no detours</span></div>

              <div className="mt-9 flex flex-wrap gap-3">
                <button onClick={downloadContact} className="inline-flex items-center gap-2 rounded-full bg-[#151716] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_20px_rgba(21,23,22,.14)] transition hover:-translate-y-0.5 hover:bg-black active:scale-[0.97]">
                  <Download className="h-4 w-4" /> Save contact
                </button>
                <button onClick={copyProfileUrl} className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-[#F7F5F1]/80 px-5 py-3.5 text-sm font-bold transition hover:border-black/35 hover:bg-white active:scale-[0.97]">
                  <Copy className="h-4 w-4" /> Copy profile link
                </button>
              </div>
            </div>
          </section>

          <section className="mt-14 border-t border-black/12 pt-5 sm:mt-16 lg:mt-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-black/45"><span className="h-px w-7 bg-black/35" /> 02 / Routes</div>
              <span className="font-mono text-[10px] text-black/38">{String(links.length).padStart(2, "0")} ACTIVE</span>
            </div>
            <div className="route-list mt-5 border-t border-black/12">
              {links.map((link, index) => (
                <a key={link.id} href={getLinkHref(link)} target={link.kind === "website" || link.kind === "instagram" || link.kind === "facebook" || link.kind === "linkedin" ? "_blank" : undefined} rel="noreferrer" className="route-row group grid grid-cols-[2.5rem_2.5rem_1fr_1.6rem] items-center gap-3 border-b border-black/12 py-4 transition hover:bg-white/55 sm:grid-cols-[3.5rem_3.5rem_1fr_auto] sm:gap-4 sm:py-5">
                  <span className="font-mono text-[10px] text-black/42">{String(index + 1).padStart(2, "0")}</span>
                  <span className="route-glyph grid h-10 w-10 place-items-center border border-black/18 bg-[#F7F5F1] text-[var(--signal)] transition group-hover:border-[var(--signal)] group-hover:bg-[var(--signal)] group-hover:text-white"><LinkIcon kind={link.kind} className="h-[17px] w-[17px] stroke-[1.8]" /></span>
                  <span className="min-w-0"><span className="block text-sm font-extrabold tracking-[-0.025em]">{link.label}</span><span className="mt-0.5 block truncate font-mono text-[11px] text-black/52">{link.value}</span></span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-black/12 transition group-hover:border-[var(--signal)] group-hover:bg-[var(--signal)] group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
                </a>
              ))}
            </div>
          </section>
        </main>

        <footer className="relative border-t border-black/10 bg-[#151716] px-5 py-6 text-white sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
            <div className="flex items-center gap-3"><BrandMark className="h-7 w-7 rounded-full bg-white p-0.5" /><p className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/57">{profile.footerNote}</p></div>
          </div>
        </footer>
      </div>
    </div>
  );
}

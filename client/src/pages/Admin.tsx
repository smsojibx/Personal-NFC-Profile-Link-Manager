/** Signal Atlas style note: the admin workspace uses a disciplined control-and-preview layout to make editing feel tangible and trustworthy. */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Cloud, Eye, KeyRound, Link2, Loader2, LogOut, MonitorUp, Plus, Save, ShieldCheck, Sparkles, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/BrandMark";
import { ProfilePresentation } from "@/components/ProfilePresentation";
import { firebaseConfigured } from "@/lib/firebase";
import { loginWithEmail, loginWithGoogle, logout, useFirebaseUser } from "@/lib/auth";
import { LINK_KINDS, saveProfile, type Profile, type ProfileLink, useProfile } from "@/lib/profile-store";
import { hasConfiguredOwner, isConfiguredOwner } from "@/lib/admin-config";

const adminArtwork = "/manus-storage/signal-atlas-admin_66f435ee.jpg";

function inputClass() {
  return "mt-2 w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-sm text-[#151716] outline-none transition placeholder:text-black/32 focus:border-[#2457F5] focus:ring-4 focus:ring-[#2457F5]/10";
}

function smallLabel(label: string, hint?: string) {
  return <div className="flex items-center justify-between gap-3"><label className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-black/52">{label}</label>{hint && <span className="text-[11px] text-black/38">{hint}</span>}</div>;
}

function defaultNewLink(): ProfileLink {
  return { id: `link-${Date.now()}`, label: "New route", value: "Add a destination", url: "https://", kind: "website", visible: true };
}

export default function Admin() {
  const { profile, loading } = useProfile("sojib");
  const { user, checking } = useFirebaseUser();
  const [draft, setDraft] = useState<Profile>(profile);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "routes" | "appearance" | "firebase">("profile");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => setDraft(profile), [profile]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(profile), [draft, profile]);

  const updateProfile = <K extends keyof Profile>(key: K, value: Profile[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const updateLink = (id: string, key: keyof ProfileLink, value: ProfileLink[keyof ProfileLink]) => {
    setDraft((current) => ({ ...current, links: current.links.map((link) => link.id === id ? { ...link, [key]: value } : link) }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const saved = await saveProfile(draft);
      setDraft(saved);
      toast.success("Published to Firebase", { description: "Your public card will update in real time." });
    } catch (error) {
      toast.error("Could not save changes", { description: error instanceof Error ? error.message : "Please check your Firebase permissions." });
    } finally {
      setSaving(false);
    }
  };

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success("Signed in securely");
    } catch (error) {
      toast.error("Sign-in failed", { description: error instanceof Error ? error.message : "Please check your credentials." });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in securely");
    } catch (error) {
      toast.error("Google sign-in failed", { description: error instanceof Error ? error.message : "Enable Google sign-in in Firebase Authentication." });
    } finally {
      setAuthLoading(false);
    }
  };

  if (!firebaseConfigured || !hasConfiguredOwner) {
    return <main className="grid min-h-screen place-items-center bg-[#F2F0EB] p-5 text-[#151716]"><section className="w-full max-w-lg border border-black/12 bg-[#F7F5F1] p-7 shadow-[0_20px_50px_rgba(35,37,34,.10)] sm:p-10"><div className="flex items-center gap-3"><BrandMark className="h-10 w-10 rounded-full bg-[#2457F5] p-1" /><p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[#2457F5]">Private editor / setup required</p></div><h1 className="mt-7 text-4xl font-extrabold tracking-[-.065em]">Editing is locked.</h1><p className="mt-4 text-sm leading-6 text-black/60">This route does not allow browser-only editing. Add the Firebase web variables and a <code className="rounded bg-black/5 px-1.5 py-0.5">VITE_ADMIN_EMAIL</code> value in your hosting environment, then rebuild the site.</p><div className="mt-7 border-t border-black/10 pt-5"><p className="font-mono text-[10px] font-bold uppercase tracking-[.13em] text-black/44">Required security controls</p><p className="mt-2 text-sm leading-6 text-black/60">Enable Firebase Authentication and apply the owner-only Firestore rules from <code className="rounded bg-black/5 px-1.5 py-0.5">README_FIREBASE.md</code>. An unlinked route alone is not a security boundary.</p></div><Link href="/" className="mt-8 inline-flex text-sm font-bold text-[#2457F5] hover:underline">Return to public profile <ChevronRight className="ml-1 h-4 w-4" /></Link></section></main>;
  }

  if (loading || checking) {
    return <div className="grid min-h-screen place-items-center bg-[#F2F0EB]"><div className="flex items-center gap-3 text-sm font-bold"><Loader2 className="h-4 w-4 animate-spin text-[#2457F5]" /> Loading your workspace</div></div>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F2F0EB] p-4 text-[#151716] sm:p-7">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-black/10 bg-[#F7F5F1] shadow-[0_24px_80px_rgba(35,37,34,.12)] lg:grid-cols-[1.05fr_.95fr]">
          <section className="relative hidden overflow-hidden bg-[#151716] p-10 text-white lg:block">
            <img src={adminArtwork} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-3"><BrandMark className="h-10 w-10 rounded-full bg-white p-1" /><div className="leading-none"><p className="font-mono text-[9px] uppercase tracking-[.22em] text-white/56">NFC identity</p><p className="mt-1.5 text-sm font-extrabold tracking-[-.04em]">SIGNAL <span className="font-mono text-[9px] font-medium tracking-[.14em] text-[#9CB5FF]">ATLAS / EDITOR</span></p></div></div>
              <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-[#9CB5FF]">Private workspace</p><h1 className="mt-4 max-w-md text-5xl font-extrabold leading-[.93] tracking-[-.07em]">Keep your tap-ready profile in command.</h1><p className="mt-6 max-w-sm leading-7 text-white/64">Your public card updates directly from the secure editor, while the design stays exact.</p></div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/46">Firebase authentication enabled</p>
            </div>
          </section>
          <section className="flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-sm"><div className="flex items-center justify-between lg:hidden"><BrandMark className="h-10 w-10 rounded-full bg-[#2457F5] p-1" /><Link href="/" className="text-xs font-bold">View profile <ChevronRight className="inline h-3 w-3" /></Link></div><p className="mt-12 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2457F5] lg:mt-0">Owner access</p><h2 className="mt-3 text-4xl font-extrabold tracking-[-.06em]">Sign in to edit.</h2><p className="mt-3 text-sm leading-6 text-black/56">Use an authorised Firebase account to manage this identity card.</p>
              <form onSubmit={handleEmailLogin} className="mt-8 space-y-4">{smallLabel("Email address")}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass()} placeholder="you@example.com" required />{smallLabel("Password")}<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass()} placeholder="••••••••" required /><button disabled={authLoading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#151716] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60 active:scale-[.98]">{authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Sign in</button></form>
              <div className="my-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[.13em] text-black/36"><span className="h-px flex-1 bg-black/10" />or<span className="h-px flex-1 bg-black/10" /></div><button onClick={handleGoogleLogin} disabled={authLoading} className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/13 bg-white px-4 py-3.5 text-sm font-bold transition hover:border-black/30 disabled:opacity-60"><Cloud className="h-4 w-4 text-[#2457F5]" /> Continue with Google</button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!isConfiguredOwner(user.email)) {
    return <main className="grid min-h-screen place-items-center bg-[#F2F0EB] p-5 text-[#151716]"><section className="w-full max-w-lg border border-black/12 bg-[#F7F5F1] p-7 shadow-[0_20px_50px_rgba(35,37,34,.10)] sm:p-10"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-amber-50 text-amber-700"><ShieldCheck className="h-5 w-5" /></span><p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-amber-700">Access denied</p></div><h1 className="mt-7 text-4xl font-extrabold tracking-[-.065em]">This account is not the owner.</h1><p className="mt-4 text-sm leading-6 text-black/60">You are signed in, but this email is not authorised to edit this card. Sign out and use the owner account configured for this site.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={() => void logout()} className="rounded-xl bg-[#151716] px-4 py-3 text-sm font-bold text-white transition hover:bg-black">Sign out</button><Link href="/" className="rounded-xl border border-black/12 px-4 py-3 text-sm font-bold transition hover:bg-black/5">View public profile</Link></div></section></main>;
  }

  const navItems = [
    { id: "profile" as const, label: "Profile", icon: UserRound },
    { id: "routes" as const, label: "Routes", icon: Link2 },
    { id: "appearance" as const, label: "Appearance", icon: Sparkles },
    { id: "firebase" as const, label: "Firebase", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-[#F2F0EB] text-[#151716]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#F7F5F1]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6"><div className="flex items-center gap-3"><BrandMark className="h-9 w-9 rounded-full bg-[#2457F5] p-1" /><div className="leading-none"><p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-black/43">Signal atlas</p><div className="mt-1.5 flex items-center gap-1.5"><span className="h-[3px] w-3 bg-[#2457F5]" /><p className="text-sm font-extrabold tracking-[-.05em]">PROFILE <span className="font-mono text-[9px] font-medium tracking-[.14em]">EDITOR</span></p></div></div></div><div className="flex items-center gap-2 sm:gap-3"><a href={`/${draft.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition hover:bg-black/5"><Eye className="h-4 w-4" /><span className="hidden sm:inline">Open card</span></a>{user && <button onClick={() => logout()} className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-black/60 transition hover:bg-black/5 sm:inline-flex"><LogOut className="h-4 w-4" /> Sign out</button>}<button onClick={save} disabled={!dirty || saving} className="inline-flex items-center gap-2 border-l border-black/15 pl-3.5 text-xs font-bold text-[#2457F5] transition hover:text-[#1845D9] disabled:cursor-not-allowed disabled:text-black/32 active:scale-[.97]">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {saving ? "Saving" : dirty ? "Publish" : "Saved"}</button></div></div>
      </header>

      {!firebaseConfigured && <div className="border-b border-black/10 bg-[#F7F5F1]"><div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-xs sm:px-6"><span className="font-mono text-[10px] font-bold tracking-[.12em] text-[#2457F5]">00 / LOCAL</span><span className="h-4 w-px bg-[#2457F5]/50" /><MonitorUp className="h-4 w-4 text-[#2457F5]" /><span className="font-bold">Browser preview is active.</span><span className="text-black/57">Connect Firebase to sync this route beyond this device.</span><button onClick={() => setActiveSection("firebase")} className="ml-auto font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[#2457F5] hover:underline">Open connection guide</button></div></div>}

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[220px_minmax(0,1fr)_minmax(340px,.9fr)]">
        <aside className="border-b border-black/10 bg-[#F7F5F1] px-4 py-4 lg:min-h-[calc(100vh-64px)] lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">{navItems.map((item) => { const Icon = item.icon; const selected = activeSection === item.id; return <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${selected ? "bg-[#151716] text-white shadow-[0_8px_18px_rgba(21,23,22,.12)]" : "text-black/58 hover:bg-black/5 hover:text-black"}`}><Icon className="h-4 w-4" />{item.label}</button>; })}</nav>
          <div className="mt-8 hidden border border-black/12 bg-[#E8E5DE] p-4 lg:block"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-black/43">Card status / 01</p><div className="mt-3 flex items-center gap-2"><span className="h-2 w-2 rounded-none bg-[#2457F5]" /><p className="text-sm font-bold">Ready to tap</p></div><p className="mt-2 border-t border-black/10 pt-2 font-mono text-[10px] leading-5 text-black/52">PUBLIC ADDRESS /{draft.slug}</p></div>
        </aside>

        <section className="min-w-0 border-black/10 bg-[#F2F0EB] px-4 py-7 sm:px-7 lg:border-r lg:px-9 lg:py-10">
          {activeSection === "profile" && <div className="mx-auto max-w-2xl"><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#2457F5]">01 / Identity</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.065em]">The essentials.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-black/56">Put the most recognisable version of you at the top. The rest of the card follows this anchor.</p><div className="mt-8 space-y-5 rounded-2xl border border-black/10 bg-[#F7F5F1] p-5 shadow-[0_12px_30px_rgba(40,42,39,.05)] sm:p-6"><div className="grid gap-5 sm:grid-cols-[90px_1fr]"><div>{smallLabel("Monogram")}<input value={draft.monogram} maxLength={3} onChange={(e) => updateProfile("monogram", e.target.value.toUpperCase())} className={`${inputClass()} text-center text-2xl font-extrabold`} /></div><div>{smallLabel("Display name")}<input value={draft.name} onChange={(e) => updateProfile("name", e.target.value)} className={inputClass()} /></div></div><div>{smallLabel("Role", "short and distinct")}<input value={draft.role} onChange={(e) => updateProfile("role", e.target.value)} className={inputClass()} /></div><div>{smallLabel("Bio", "one or two clear sentences")}<textarea value={draft.bio} onChange={(e) => updateProfile("bio", e.target.value)} rows={3} className={`${inputClass()} resize-none`} /></div><div className="grid gap-5 sm:grid-cols-2"><div>{smallLabel("Public slug")}<div className="mt-2 flex rounded-xl border border-black/10 bg-white focus-within:border-[#2457F5] focus-within:ring-4 focus-within:ring-[#2457F5]/10"><span className="grid place-items-center border-r border-black/8 px-3 font-mono text-xs text-black/42">/</span><input value={draft.slug} onChange={(e) => updateProfile("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" /></div></div><div>{smallLabel("Email")}<input type="email" value={draft.email} onChange={(e) => updateProfile("email", e.target.value)} className={inputClass()} /></div></div><div>{smallLabel("Avatar image URL", "optional")}<input value={draft.avatarUrl} onChange={(e) => updateProfile("avatarUrl", e.target.value)} placeholder="https://…" className={inputClass()} /></div></div></div>}

          {activeSection === "routes" && <div className="mx-auto max-w-2xl"><div className="flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#2457F5]">02 / Routes</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.065em]">Choose the next step.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-black/56">Links appear in the order shown. Keep the most useful action near the top.</p></div><button onClick={() => setDraft((current) => ({ ...current, links: [...current.links, defaultNewLink()] }))} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#151716] px-3.5 py-3 text-xs font-bold text-white transition hover:bg-black active:scale-[.97]"><Plus className="h-4 w-4" /> Add route</button></div><div className="mt-8 space-y-4">{draft.links.map((link, index) => <article key={link.id} className="rounded-2xl border border-black/10 bg-[#F7F5F1] p-5 shadow-[0_10px_22px_rgba(40,42,39,.045)]"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="font-mono text-[10px] text-black/42">{String(index + 1).padStart(2, "0")}</span><p className="text-sm font-extrabold">{link.label || "Untitled route"}</p></div><div className="flex items-center gap-1"><button onClick={() => updateLink(link.id, "visible", !link.visible)} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${link.visible ? "bg-[#E8EEFF] text-[#2457F5]" : "bg-black/5 text-black/42"}`}>{link.visible ? "Visible" : "Hidden"}</button><button onClick={() => setDraft((current) => ({ ...current, links: current.links.filter((item) => item.id !== link.id) }))} className="grid h-8 w-8 place-items-center rounded-lg text-black/46 transition hover:bg-red-50 hover:text-red-600" aria-label="Remove route"><Trash2 className="h-4 w-4" /></button></div></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><div>{smallLabel("Label")}<input value={link.label} onChange={(e) => updateLink(link.id, "label", e.target.value)} className={inputClass()} /></div><div>{smallLabel("Type")}<select value={link.kind} onChange={(e) => updateLink(link.id, "kind", e.target.value as ProfileLink["kind"])} className={inputClass()}>{LINK_KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}</select></div><div>{smallLabel("Text shown")}<input value={link.value} onChange={(e) => updateLink(link.id, "value", e.target.value)} className={inputClass()} /></div><div>{smallLabel("Destination URL")}<input value={link.url} onChange={(e) => updateLink(link.id, "url", e.target.value)} className={inputClass()} placeholder="https:// or mailto:" /></div></div></article>)}</div></div>}

          {activeSection === "appearance" && <div className="mx-auto max-w-2xl"><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#2457F5]">03 / Appearance</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.065em]">Make it recognisable.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-black/56">Signal cobalt is the default. Use a strong, legible colour if you want the card to wear your own identity.</p><div className="mt-8 rounded-2xl border border-black/10 bg-[#F7F5F1] p-5 shadow-[0_12px_30px_rgba(40,42,39,.05)] sm:p-6"><div className="grid gap-5 sm:grid-cols-[1fr_180px]"><div>{smallLabel("Signature colour")}<input value={draft.accentColor} onChange={(e) => updateProfile("accentColor", e.target.value)} className={inputClass()} placeholder="#2457F5" /></div><div>{smallLabel("Colour sample")}<div className="mt-2 flex h-[46px] items-center rounded-xl border border-black/10 bg-white p-1"><input aria-label="Choose signature colour" type="color" value={draft.accentColor} onChange={(e) => updateProfile("accentColor", e.target.value)} className="h-full w-full cursor-pointer rounded-lg border-0 bg-transparent" /></div></div></div><div className="mt-6">{smallLabel("Footer note")}<input value={draft.footerNote} onChange={(e) => updateProfile("footerNote", e.target.value)} className={inputClass()} /></div><div className="mt-6 rounded-xl bg-[#E8EEFF] p-4"><div className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#2457F5]" /><p className="text-xs leading-5 text-black/65"><strong className="text-black">Design guardrail:</strong> this template keeps the primary type and structure fixed so the NFC card stays instantly familiar after every tap.</p></div></div></div></div>}

          {activeSection === "firebase" && <div className="mx-auto max-w-2xl"><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#2457F5]">04 / Firebase</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.065em]">Connect the live data layer.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-black/56">This editor is ready for Firebase Authentication and Cloud Firestore. Your current mode is shown below.</p><div className="mt-8 rounded-2xl border border-black/10 bg-[#F7F5F1] p-5 shadow-[0_12px_30px_rgba(40,42,39,.05)] sm:p-6"><div className="flex items-start gap-4"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${firebaseConfigured ? "bg-[#E8EEFF] text-[#2457F5]" : "bg-amber-50 text-amber-700"}`}><Cloud className="h-5 w-5" /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-extrabold">{firebaseConfigured ? "Firebase connected" : "Firebase configuration needed"}</h2><span className={`rounded-full px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[.12em] ${firebaseConfigured ? "bg-[#E8EEFF] text-[#2457F5]" : "bg-amber-100 text-amber-700"}`}>{firebaseConfigured ? "Live" : "Local"}</span></div><p className="mt-2 text-sm leading-6 text-black/57">{firebaseConfigured ? "Auth and Firestore are ready. Sign in with an approved account before editing." : "The editor is working in a browser-only preview. Add your Firebase web credentials before production launch."}</p></div></div><div className="mt-6 border-t border-black/10 pt-5"><p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-black/45">Required public environment variables</p><div className="mt-3 grid gap-2 rounded-xl bg-[#151716] p-4 font-mono text-[11px] leading-5 text-white/68"><span>VITE_FIREBASE_API_KEY</span><span>VITE_FIREBASE_AUTH_DOMAIN</span><span>VITE_FIREBASE_PROJECT_ID</span><span>VITE_FIREBASE_STORAGE_BUCKET</span><span>VITE_FIREBASE_MESSAGING_SENDER_ID</span><span>VITE_FIREBASE_APP_ID</span></div><p className="mt-4 text-xs leading-5 text-black/52">Create the <code className="rounded bg-black/5 px-1.5 py-0.5">profiles/sojib</code> document in Cloud Firestore, enable Email/Password or Google sign-in, and use the included setup guide for secure Firestore rules.</p></div></div></div>}
        </section>

        <aside className="hidden bg-[#E8E5DE] p-7 lg:block"><div className="sticky top-24"><div className="mb-4 flex items-center justify-between"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[.15em] text-black/40">Live preview</p><p className="mt-1 text-sm font-extrabold">Tap experience</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.12em] text-black/48"><span className="h-1.5 w-1.5 rounded-full bg-[#2457F5]" />{dirty ? "Draft" : "Live"}</span></div><div className="mx-auto max-w-[360px] rounded-[2rem] border-[7px] border-[#151716] bg-[#151716] p-1.5 shadow-[0_30px_45px_rgba(21,23,22,.18)]"><div className="max-h-[740px] overflow-y-auto rounded-[1.55rem]"><ProfilePresentation profile={draft} embedded /></div></div><p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[.13em] text-black/39">Scaled mobile preview</p></div></aside>
      </div>
    </main>
  );
}

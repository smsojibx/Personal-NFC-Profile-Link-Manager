/** Signal Atlas style note: profile data is intentionally compact so the public tap experience stays focused and credible. */
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { firebaseDb, firebaseConfigured } from "@/lib/firebase";

export type LinkKind = "website" | "instagram" | "facebook" | "linkedin" | "whatsapp" | "phone" | "email" | "location" | "calendar";

export type ProfileLink = {
  id: string;
  label: string;
  value: string;
  url: string;
  kind: LinkKind;
  visible: boolean;
};

export type Profile = {
  id: string;
  slug: string;
  name: string;
  monogram: string;
  role: string;
  bio: string;
  avatarUrl: string;
  email: string;
  accentColor: string;
  footerNote: string;
  links: ProfileLink[];
  updatedAt?: number;
};

export const LINK_KINDS: { value: LinkKind; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "location", label: "Location" },
  { value: "calendar", label: "Calendar" },
];

export const DEFAULT_PROFILE: Profile = {
  id: "sojib",
  slug: "sojib",
  name: "S M Sujauddula Sojib",
  monogram: "S",
  role: "Digital Systems Designer",
  bio: "Designing clear digital systems and memorable online touchpoints for independent teams.",
  avatarUrl: "",
  email: "hello@signalatlas.studio",
  accentColor: "#2457F5",
  footerNote: "Tap saved. Stay connected.",
  links: [
    { id: "instagram", label: "Instagram", value: "@smsojibx", url: "https://instagram.com/smsojibx", kind: "instagram", visible: true },
    { id: "facebook", label: "Facebook", value: "@smsojibx", url: "https://facebook.com/smsojibx", kind: "facebook", visible: true },
    { id: "whatsapp", label: "WhatsApp", value: "+880 1410 320080", url: "https://wa.me/8801410320080", kind: "whatsapp", visible: true },
    { id: "portfolio", label: "Selected work", value: "Portfolio", url: "https://example.com", kind: "website", visible: true },
  ],
};

const storageKey = (slug: string) => `signal-atlas-profile:${slug}`;

function normalizeProfile(raw: Partial<Profile> | undefined, slug: string): Profile {
  return {
    ...DEFAULT_PROFILE,
    ...raw,
    name: raw?.name === "SM Siyamddula Sojib" ? "S M Sujauddula Sojib" : raw?.name || DEFAULT_PROFILE.name,
    id: raw?.id || slug,
    slug,
    links: Array.isArray(raw?.links) && raw.links.length ? raw.links : DEFAULT_PROFILE.links,
  };
}

export function loadLocalProfile(slug: string): Profile {
  if (typeof window === "undefined") return normalizeProfile(undefined, slug);
  try {
    const stored = window.localStorage.getItem(storageKey(slug));
    return normalizeProfile(stored ? JSON.parse(stored) : undefined, slug);
  } catch {
    return normalizeProfile(undefined, slug);
  }
}

function storeLocalProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(profile.slug), JSON.stringify(profile));
}

export async function saveProfile(profile: Profile) {
  if (!firebaseDb) {
    throw new Error("Firebase is required to publish profile changes.");
  }
  const prepared = { ...profile, updatedAt: Date.now() };
  await setDoc(doc(firebaseDb, "profiles", prepared.slug), prepared, { merge: true });
  return prepared;
}

export function useProfile(slug: string) {
  const initial = useMemo(() => loadLocalProfile(slug), [slug]);
  const [profile, setProfile] = useState<Profile>(initial);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [source, setSource] = useState<"firebase" | "local">(firebaseConfigured ? "firebase" : "local");

  useEffect(() => {
    setProfile(loadLocalProfile(slug));
    if (!firebaseDb) {
      setSource("local");
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(firebaseDb, "profiles", slug),
      (snapshot) => {
        setProfile(normalizeProfile(snapshot.exists() ? (snapshot.data() as Partial<Profile>) : undefined, slug));
        setSource("firebase");
        setLoading(false);
      },
      () => {
        setProfile(loadLocalProfile(slug));
        setSource("local");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [slug]);

  return { profile, loading, source };
}

export function getLinkHref(link: ProfileLink) {
  if (link.url) return link.url;
  if (link.kind === "email") return `mailto:${link.value}`;
  if (link.kind === "phone") return `tel:${link.value.replace(/\s/g, "")}`;
  return "#";
}

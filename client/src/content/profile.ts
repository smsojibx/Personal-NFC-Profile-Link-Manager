/**
 * Single source of truth for the card.
 * To add a link: append one entry to `links` — order here is the order on the page.
 */

export type LinkKind =
  | "portfolio"
  | "product"
  | "github"
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "email"
  | "phone"
  | "custom";

export type ProfileLink = {
  id: string;
  label: string;
  value: string;
  note: string;
  href: string;
  kind: LinkKind;
  /** Opens in a new tab. Internal / mailto / tel links stay in place. */
  external: boolean;
};

export type Profile = {
  name: string;
  monogram: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  status: string;
  highlight: string;
  email: string;
  phone: string;
  cardUrl: string;
  links: ProfileLink[];
};

export const profile: Profile = {
  name: "S M Sujauddula Sojib",
  monogram: "S",
  role: "Web Developer & Technology Entrepreneur",
  tagline: "Websites, APIs and AI-assisted tools — built to still work on a Monday morning.",
  bio: "I build the parts of a product nobody photographs: the validation, the retries, the logs. Based in Rangpur, working with teams that need something dependable online.",
  location: "Rangpur, Bangladesh",
  status: "Open for work",
  highlight: "Top 5 · Agent X Junior 2026",
  email: "hello@smsojib.com",
  phone: "+8801410320080",
  cardUrl: "https://svcbysm.web.app",
  links: [
    {
      id: "portfolio",
      label: "Portfolio",
      value: "smsojib.com",
      note: "Selected work and case studies",
      href: "https://smsojib.com",
      kind: "portfolio",
      external: true,
    },
    {
      id: "nrito",
      label: "Nrito",
      value: "nrito.com",
      note: "Browser-native motion workspace",
      href: "https://nrito.com",
      kind: "product",
      external: true,
    },
    {
      id: "github",
      label: "GitHub",
      value: "@smsojibx",
      note: "Code, experiments and open source",
      href: "https://github.com/smsojibx",
      kind: "github",
      external: true,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: "+880 1410 320080",
      note: "Fastest way to reach me",
      href: "https://wa.me/8801410320080",
      kind: "whatsapp",
      external: true,
    },
    {
      id: "facebook",
      label: "Facebook",
      value: "@smsojibx",
      note: "Updates and day-to-day work",
      href: "https://www.facebook.com/smsojibx",
      kind: "facebook",
      external: true,
    },
    {
      id: "email",
      label: "Email",
      value: "hello@smsojib.com",
      note: "Project briefs and enquiries",
      href: "mailto:hello@smsojib.com?subject=Project%20enquiry",
      kind: "email",
      external: false,
    },
  ],
};

/** Handles printed on the physical NFC card. */
export const cardHandles: { kind: "facebook" | "instagram" | "whatsapp" | "x"; handle: string }[] = [
  { kind: "facebook", handle: "@smsojibx" },
  { kind: "instagram", handle: "@smsojibx" },
  { kind: "whatsapp", handle: "@smsojibx" },
  { kind: "x", handle: "@smsojibx" },
];

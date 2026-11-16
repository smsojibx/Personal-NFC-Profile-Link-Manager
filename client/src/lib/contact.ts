import { profile } from "@/content/profile";

/** Builds a vCard 3.0 file so a tap can save the full contact. */
export function buildVCard() {
  const { name, role, email, phone, cardUrl, location, links } = profile;
  const [, ...rest] = name.split(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${name.split(" ")[0]};;;`,
    `FN:${name}`,
    `TITLE:${role}`,
    "ORG:Nrito",
    `EMAIL;TYPE=INTERNET,WORK:${email}`,
    `TEL;TYPE=CELL,VOICE:${phone}`,
    `URL:${cardUrl}`,
    `URL;TYPE=Portfolio:${links[0]?.href ?? cardUrl}`,
    `ADR;TYPE=WORK:;;${location};;;;`,
    `NOTE:${profile.tagline}`,
    "END:VCARD",
  ];
  return lines.join("\r\n");
}

export function downloadVCard() {
  const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "S-M-Sujauddula-Sojib.vcf";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Native share sheet where available, clipboard everywhere else. */
export async function shareCard(): Promise<"shared" | "copied" | "cancelled"> {
  const url = profile.cardUrl;
  const data = {
    title: `${profile.name} — digital card`,
    text: profile.tagline,
    url,
  };

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "cancelled";
  }
}

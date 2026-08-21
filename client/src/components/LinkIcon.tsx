/** Signal Atlas style note: contact icons are decisive navigation signs—simple, legible, and never ornamental. */
import { CalendarDays, Facebook, Globe2, Instagram, Linkedin, Mail, MapPin, Phone, type LucideProps, MessageCircle } from "lucide-react";
import type { LinkKind } from "@/lib/profile-store";

const iconMap: Record<LinkKind, React.ComponentType<LucideProps>> = {
  website: Globe2,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  phone: Phone,
  email: Mail,
  location: MapPin,
  calendar: CalendarDays,
};

export function LinkIcon({ kind, ...props }: { kind: LinkKind } & LucideProps) {
  const Icon = iconMap[kind] || Globe2;
  return <Icon {...props} />;
}


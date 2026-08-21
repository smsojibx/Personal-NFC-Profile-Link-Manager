/** Signal Atlas style note: this public page is a single, premium identity route engineered for tap-to-contact speed. */
import { Loader2 } from "lucide-react";
import { useParams } from "wouter";
import { ProfilePresentation } from "@/components/ProfilePresentation";
import { useProfile } from "@/lib/profile-store";

export default function Home() {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug || "sojib";
  const { profile, loading } = useProfile(slug);

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#F7F5F1] text-sm font-bold text-[#151716]"><span className="flex items-center gap-3"><Loader2 className="h-4 w-4 animate-spin text-[#2457F5]" /> Opening your profile</span></div>;
  }

  return <ProfilePresentation profile={profile} />;
}

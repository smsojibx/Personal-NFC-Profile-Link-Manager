import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Sparkles, Trophy } from "lucide-react";
import { NfcCard } from "@/components/NfcCard";
import { LinkTile } from "@/components/LinkTile";
import {
  CheckIcon,
  DownloadIcon,
  NfcWaves,
  ShareIcon,
} from "@/components/Icons";
import { profile } from "@/content/profile";
import { downloadVCard, shareCard } from "@/lib/contact";

export default function Home() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const onSave = () => {
    downloadVCard();
    notify("Contact saved to your device");
  };

  const onShare = async () => {
    const result = await shareCard();
    if (result === "shared") return;
    notify(result === "copied" ? "Card link copied" : "Could not share this card");
  };

  return (
    <>
      <div className="scene-bg" aria-hidden>
        <span className="scene-bg__glow scene-bg__glow--one" />
        <span className="scene-bg__glow scene-bg__glow--two" />
        <svg className="scene-bg__wave" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bgWave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9adcf4" stopOpacity="0" />
              <stop offset="40%" stopColor="#7cc9ea" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1a7fc1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 250 C 180 160, 320 320, 520 250 S 860 150, 1060 240 S 1160 270, 1200 240"
            fill="none"
            stroke="url(#bgWave)"
            strokeWidth="1.4"
          />
          <path
            d="M0 300 C 200 210, 340 360, 560 292 S 900 200, 1100 286 S 1170 306, 1200 292"
            fill="none"
            stroke="url(#bgWave)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="page">
        <header className="topbar reveal">
          <div className="brandchip">
            <span className="brandchip__mark" aria-hidden>
              <NfcWaves />
            </span>
            <span className="brandchip__text">
              <span className="brandchip__label">Digital business card</span>
              <span className="brandchip__sub">svcbysm.web.app</span>
            </span>
          </div>
          <span className="status">
            <span className="status__dot" aria-hidden />
            {profile.status}
          </span>
        </header>

        <div className="layout">
          <div className="left-rail">
            <NfcCard />

            <section className="identity reveal" style={{ animationDelay: "80ms" }}>
              <p className="eyebrow">Digital card</p>
              <h1 className="name">{profile.name}</h1>
              <p className="role">{profile.role}</p>
              <p className="tagline">{profile.tagline}</p>

              <div className="chips">
                <span className="chip">
                  <MapPin strokeWidth={1.8} />
                  {profile.location}
                </span>
                <span className="chip">
                  <Sparkles strokeWidth={1.8} />
                  Web · API · AI tooling
                </span>
                <span className="chip">
                  <Trophy strokeWidth={1.8} />
                  {profile.highlight}
                </span>
              </div>

              <div className="actions">
                <button className="btn btn--primary" type="button" onClick={onSave}>
                  <DownloadIcon />
                  Save contact
                </button>
                <button className="btn btn--ghost" type="button" onClick={onShare}>
                  <ShareIcon />
                  Share card
                </button>
              </div>
            </section>
          </div>

          <section className="links reveal" style={{ animationDelay: "140ms" }} aria-labelledby="links-title">
            <div className="section-head">
              <h2 className="section-title" id="links-title">
                Everything in one tap
              </h2>
              <span className="section-count">{String(profile.links.length).padStart(2, "0")} links</span>
            </div>

            <div className="tiles">
              {profile.links.map((link, index) => (
                <LinkTile key={link.id} link={link} index={index} />
              ))}
            </div>

            <p className="links__foot">
              Prefer to talk? WhatsApp reaches me fastest — usually within a few hours.
            </p>
          </section>
        </div>

        <footer className="footer">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="footer__nfc">
            <NfcWaves />
            Tap the card, keep the connection
          </span>
        </footer>
      </div>

      {toast ? (
        <div className="toast" role="status">
          <CheckIcon />
          {toast}
        </div>
      ) : null}
    </>
  );
}

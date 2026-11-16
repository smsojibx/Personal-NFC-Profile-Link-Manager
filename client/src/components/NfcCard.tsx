import { useRef } from "react";
import { cardHandles, profile } from "@/content/profile";
import { CardHandleIcon, NfcWaves } from "@/components/Icons";

/**
 * A 1:1 replica of the printed NFC card — paper white, navy monogram,
 * handwritten handles, tap-to-connect ring — lifted into a pointer-tracked 3D pose.
 */
export function NfcCard() {
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = stage.current;
    const face = card.current;
    if (!el || !face) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const ry = -11 + (px - 0.5) * 20;
    const rx = 9 - (py - 0.5) * 14;
    face.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    face.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
  };

  const handleLeave = () => {
    const face = card.current;
    if (!face) return;
    face.style.setProperty("--rx", "9deg");
    face.style.setProperty("--ry", "-11deg");
  };

  return (
    <div className="card-stage" ref={stage} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <div className="card-stage__shadow" aria-hidden />
      <div className="card-float">
        <div className="card-3d" ref={card}>
          <div className="nfc-card" role="img" aria-label={`NFC card of ${profile.name}`}>
            <svg className="nfc-card__wave" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="waveA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8ad8f2" stopOpacity="0.55" />
                  <stop offset="38%" stopColor="#3fb0dd" stopOpacity="0.9" />
                  <stop offset="72%" stopColor="#1a7fc1" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c9eefb" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1a7fc1" stopOpacity="0.12" />
                  <stop offset="30%" stopColor="#1a7fc1" stopOpacity="0.55" />
                  <stop offset="70%" stopColor="#0f5f92" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1a7fc1" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bfeaf9" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#9adcf4" stopOpacity="0.45" />
                </linearGradient>
              </defs>
              {/* soft printed wash under the ribbons */}
              <path
                d="M-20 196 C 95 128, 195 236, 305 168 S 475 104, 595 168 S 735 206, 820 150 L 820 320 L -20 320 Z"
                fill="url(#waveFill)"
              />
              {/* main ribbon */}
              <path
                d="M-20 208 C 92 138, 192 244, 302 176 S 472 112, 592 176 S 732 212, 820 158"
                fill="none"
                stroke="url(#waveA)"
                strokeWidth="7"
                strokeOpacity="0.28"
                strokeLinecap="round"
              />
              {/* ribbon contours, like the fine lines on the printed card */}
              <path
                d="M-20 208 C 92 138, 192 244, 302 176 S 472 112, 592 176 S 732 212, 820 158"
                fill="none"
                stroke="url(#waveStroke)"
                strokeWidth="2.4"
              />
              <path
                d="M-20 228 C 92 160, 192 264, 302 196 S 472 132, 592 196 S 732 232, 820 178"
                fill="none"
                stroke="url(#waveStroke)"
                strokeWidth="1"
              />
              <path
                d="M-20 250 C 92 184, 192 286, 302 218 S 472 154, 592 218 S 732 252, 820 200"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.55"
                strokeWidth="1.2"
              />
            </svg>

            <div className="nfc-card__monogram">
              <span className="nfc-card__initial">{profile.monogram}</span>
            </div>

            <div className="nfc-card__divider" aria-hidden />

            <ul className="nfc-card__handles">
              {cardHandles.map((item) => (
                <li className="nfc-card__handle" key={item.kind}>
                  <span className="nfc-card__handle-icon">
                    <CardHandleIcon kind={item.kind} />
                  </span>
                  <span className="nfc-card__handle-text">{item.handle}</span>
                </li>
              ))}
            </ul>

            <div className="nfc-card__tap">
              <span className="nfc-card__tap-rings">
                <NfcWaves className="nfc-card__tap-glyph" />
              </span>
              <span className="nfc-card__tap-label">TAP TO CONNECT</span>
            </div>

            <div className="nfc-card__sheen" aria-hidden />
          </div>
        </div>
      </div>
      <p className="card-caption">
        <span className="card-caption__line" aria-hidden />
        Tap · Save · Connect
        <span className="card-caption__line" aria-hidden />
      </p>
    </div>
  );
}

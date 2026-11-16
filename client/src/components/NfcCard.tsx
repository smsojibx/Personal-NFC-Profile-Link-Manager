import { useRef } from "react";
import { cardHandles, profile } from "@/content/profile";
import { CardHandleIcon, NfcWaves } from "@/components/Icons";
import { CardWave } from "@/components/CardWave";

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
            <CardWave />

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

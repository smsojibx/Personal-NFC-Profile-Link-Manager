/** Signal Atlas style note: the NFC signal mark is the compact, graphic anchor of the visual system. */
import { cn } from "@/lib/utils";

const markUrl = "/manus-storage/signal-atlas-mark_63b6847a.png";

export function BrandMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <div className={cn("grid shrink-0 place-items-center overflow-hidden", inverted && "bg-white", className)} aria-hidden="true">
      <img src={markUrl} alt="" className="h-full w-full object-contain" />
    </div>
  );
}


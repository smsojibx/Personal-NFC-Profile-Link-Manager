import { ArrowUpRight, LinkKindIcon } from "@/components/Icons";
import type { ProfileLink } from "@/content/profile";

export function LinkTile({ link, index }: { link: ProfileLink; index: number }) {
  return (
    <a
      className={`tile tile--${link.kind} reveal`}
      href={link.href}
      style={{ animationDelay: `${120 + index * 55}ms` }}
      {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      aria-label={`${link.label} — ${link.note}`}
    >
      <span className="tile__icon" aria-hidden>
        <LinkKindIcon kind={link.kind} />
      </span>
      <span className="tile__body">
        <span className="tile__label">{link.label}</span>
        <span className="tile__meta">
          <span className="tile__value">{link.value}</span>
          <span className="tile__dot" aria-hidden />
          <span className="tile__note">{link.note}</span>
        </span>
      </span>
      <span className="tile__arrow" aria-hidden>
        <ArrowUpRight />
      </span>
    </a>
  );
}

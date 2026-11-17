/** 404 and offline: the card's paper, the card's navy, nothing borrowed. */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { NfcWaves } from "@/components/Icons";
import { profile } from "@/content/profile";

type Props = {
  code: string;
  title: string;
  body: string;
  children?: React.ReactNode;
};

function Shell({ code, title, body, children }: Props) {
  return (
    <main className="sys">
      <div className="sys__inner">
        <a className="sys__brand" href="/" aria-label="Back to the card">
          <span className="sys__mark" aria-hidden>
            <NfcWaves />
          </span>
          <span>{profile.name}</span>
        </a>
        <p className="sys__code">{code}</p>
        <h1 className="sys__title">{title}</h1>
        <p className="sys__body">{body}</p>
        <div className="sys__actions">{children}</div>
      </div>
    </main>
  );
}

export function NotFoundPage({ path }: { path: string }) {
  const [location] = useLocation();
  const shown = location && location !== "/" ? location : path;

  useEffect(() => {
    const previous = document.title;
    document.title = "Page not found — S M Sujauddula Sojib";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <Shell
      code="404"
      title="This link goes nowhere."
      body={`Nothing is stored at ${shown}. If you tapped a card, the link may have been mistyped — the card itself is all one page.`}
    >
      <a className="btn btn--primary" href="/">
        Open the card
      </a>
      <a className="sys__ghost" href={`mailto:${profile.email}`}>
        Email me instead
      </a>
    </Shell>
  );
}

export function OfflinePage() {
  const [retrying, setRetrying] = useState(false);

  return (
    <Shell
      code="Offline"
      title="No connection right now."
      body="The card needs the network to load your links. Turn on Wi-Fi or mobile data — it will come back on its own the moment you're connected."
    >
      <button
        className="btn btn--primary"
        type="button"
        aria-busy={retrying}
        onClick={() => {
          setRetrying(true);
          window.location.reload();
        }}
      >
        {retrying ? "Reconnecting…" : "Try again"}
      </button>
      <a className="sys__ghost" href={`mailto:${profile.email}`}>
        Email me instead
      </a>
    </Shell>
  );
}

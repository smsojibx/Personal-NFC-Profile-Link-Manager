/** One public card, nothing else to distract from the tap. */
import { useEffect, useState } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import { NotFoundPage, OfflinePage } from "@/pages/SystemPages";

export default function App() {
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  if (!online) return <OfflinePage />;

  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/card" component={Home} />
        <Route>
          <NotFoundPage path={window.location.pathname} />
        </Route>
      </Switch>
    </ErrorBoundary>
  );
}

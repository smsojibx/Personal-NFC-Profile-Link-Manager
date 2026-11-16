/** One public card, nothing else to distract from the tap. */
import { Route, Switch } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/card" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

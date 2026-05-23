import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Zap } from "lucide-react";

export function FoundingBanner() {
  const [dismissed, setDismissed] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("founding_banner_dismissed") === "true"
  );

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem("founding_banner_dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="bg-foreground text-background">
      <div className="container-wide py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
          <span className="text-background/90">
            <strong className="text-background">Founding member offer:</strong>{" "}
            Lock in Growth at $399/year — price guaranteed forever.{" "}
            <Link to="/pricing" className="underline underline-offset-2 hover:no-underline font-medium text-primary">
              5 spots remaining →
            </Link>
          </span>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-background/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-background/60" />
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Users } from "lucide-react";

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
    <div className="bg-primary text-primary-foreground">
      <div className="container-wide py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Founding member offer:</strong> Lock in Builder at $299/year forever — only 5 spots.{" "}
            <Link to="/pricing#founding" className="underline underline-offset-2 hover:no-underline font-medium">
              See the offer →
            </Link>
          </span>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-primary-foreground/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

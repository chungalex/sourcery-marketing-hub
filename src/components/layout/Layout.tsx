import { ReactNode } from "react";
import { Header } from "./Header";
import { FoundingBanner } from "./FoundingBanner";
import { Footer } from "./Footer";
import { BackToTop } from "@/components/BackToTop";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <FoundingBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}

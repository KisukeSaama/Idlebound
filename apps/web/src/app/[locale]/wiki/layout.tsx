import type { ReactNode } from "react";
import { SpoilerProvider } from "@/wiki/SpoilerMode";
import "@/wiki/wiki.css";

/** Every wiki page shares one reading mode, kept while the walker goes from page to page. */
export default function WikiLayout({ children }: { children: ReactNode }) {
  return <SpoilerProvider>{children}</SpoilerProvider>;
}

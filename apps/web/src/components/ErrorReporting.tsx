"use client";

import { useEffect } from "react";
import { installErrorReporting } from "@/lib/errorReport";

/** Reports the errors no boundary caught, on every page (see lib/errorReport.ts). Renders nothing. */
export function ErrorReporting() {
  useEffect(() => installErrorReporting(), []);
  return null;
}

"use client";

import type { ToastInput } from "../context";
import { Picto } from "../icons";

export interface Toast extends ToastInput {
  id: number;
}

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`} style={toast.color ? { ["--toast-color" as string]: toast.color } : undefined}>
          {toast.icon ? <Picto name={toast.icon} size={28} className="toast-icon" /> : null}
          <div>
            <div className="toast-title">{toast.title}</div>
            {toast.text ? <div className="toast-text">{toast.text}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";

interface ModalProps {
  title: string;
  icon?: ReactNode;
  onClose?: () => void;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  onTab?: (id: string) => void;
}

/** Accessible modal window: trapped focus, Escape, click on the backdrop to close. */
export function Modal({ title, icon, onClose, size = "md", children, footer, tabs, activeTab, onTab }: ModalProps) {
  const titleId = useId();
  const { t } = useI18n();
  const dialog = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const first = dialog.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    first?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeRef.current) {
        event.stopPropagation();
        closeRef.current();
      }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusables = Array.from(dialog.current.querySelectorAll<HTMLElement>("button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex='-1'])"));
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <div className="modal-backdrop" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
      <div ref={dialog} className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="modal-head">
          {icon ? <span className="modal-icon" aria-hidden="true">{icon}</span> : null}
          <h2 id={titleId}>{title}</h2>
          {onClose ? <button type="button" className="modal-close" aria-label={t.hud.modal.close} onClick={onClose}>✕</button> : null}
        </header>
        {tabs ? (
          <div className="modal-tabs" role="tablist">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => onTab?.(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-foot">{footer}</footer> : null}
      </div>
    </div>
  );
}

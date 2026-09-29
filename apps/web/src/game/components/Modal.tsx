"use client";

import { useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";
import { Picto } from "../icons";
import { coverScene } from "./SceneCanvas";
import { PHONE_QUERY } from "./Toasts";

/** On a phone the window is a sheet: pulled down past this, it lets go and closes. */
const DISMISS_PX = 96;
/** A quick flick closes it too, however short (px per ms). */
const DISMISS_SPEED = 0.6;
const SHEET_OUT_MS = 160;

interface ModalProps {
  title: string;
  icon?: ReactNode;
  onClose?: () => void;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
  /** Beside the title, before the close button: what the window spends, kept in sight. */
  aside?: ReactNode;
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  onTab?: (id: string) => void;
}

/** Accessible modal window: trapped focus, Escape, click on the backdrop to close. */
export function Modal({ title, icon, onClose, size = "md", children, footer, aside, tabs, activeTab, onTab }: ModalProps) {
  const titleId = useId();
  const tabsId = useId();
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const { t } = useI18n();
  const dialog = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    // The scene behind the veil slows down while the window is open.
    const uncover = coverScene();
    const previous = document.activeElement as HTMLElement | null;
    const first = dialog.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    first?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeRef.current) {
        event.stopPropagation();
        closeRef.current();
      }
      if (event.key !== "Tab" || !dialog.current) return;
      // The inactive tabs are skipped by Tab (roving tabindex): only the reachable ones count.
      const focusables = Array.from(dialog.current.querySelectorAll<HTMLElement>("button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex='-1'])")).filter((element) => element.tabIndex >= 0);
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
      uncover();
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  /**
   * The sheet follows a finger pulled down from its head and closes past a threshold (or on a
   * flick); released short, it settles back. Mouse and desktop windows keep their close key.
   */
  const pull = useRef<{ y: number; at: number } | null>(null);
  const sheet = () => dialog.current?.style;
  const onPullStart = (event: ReactPointerEvent<HTMLElement>) => {
    if (!onClose || event.pointerType === "mouse" || !window.matchMedia(PHONE_QUERY).matches) return;
    if ((event.target as HTMLElement).closest("button, a, input, select")) return;
    pull.current = { y: event.clientY, at: performance.now() };
    event.currentTarget.setPointerCapture(event.pointerId);
    const style = sheet();
    if (style) style.transition = "none";
  };
  const onPullMove = (event: ReactPointerEvent<HTMLElement>) => {
    const style = sheet();
    if (!pull.current || !style) return;
    style.transform = `translateY(${Math.max(0, event.clientY - pull.current.y)}px)`;
  };
  const onPullEnd = (event: ReactPointerEvent<HTMLElement>) => {
    const style = sheet();
    const from = pull.current;
    pull.current = null;
    if (!from || !style) return;
    const dy = Math.max(0, event.clientY - from.y);
    const speed = dy / Math.max(1, performance.now() - from.at);
    const still = document.documentElement.classList.contains("reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (event.type === "pointerup" && (dy > DISMISS_PX || (dy > 24 && speed > DISMISS_SPEED))) {
      if (still) {
        onClose?.();
        return;
      }
      style.transition = `transform ${SHEET_OUT_MS}ms cubic-bezier(0.4, 0, 1, 1)`;
      style.transform = "translateY(100%)";
      setTimeout(() => closeRef.current?.(), SHEET_OUT_MS);
      return;
    }
    style.transition = still ? "none" : "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)";
    style.transform = "";
  };

  /** Arrow keys, Home and End move between the tabs and open the one reached. */
  const onTabKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!tabs || tabs.length === 0) return;
    const index = Math.max(0, tabs.findIndex((tab) => tab.id === activeTab));
    const next =
      event.key === "ArrowRight" ? (index + 1) % tabs.length
      : event.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length
      : event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1
      : -1;
    if (next < 0) return;
    event.preventDefault();
    const id = tabs[next].id;
    onTab?.(id);
    tabRefs.current.get(id)?.focus();
  };

  return (
    <div className="modal-backdrop" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
      <div ref={dialog} className={`modal modal-${size}${tabs ? " modal-tabbed" : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="modal-head" onPointerDown={onPullStart} onPointerMove={onPullMove} onPointerUp={onPullEnd} onPointerCancel={onPullEnd}>
          {onClose ? <span className="modal-grip" aria-hidden="true" /> : null}
          {icon ? <span className="modal-icon" aria-hidden="true">{icon}</span> : null}
          <h2 id={titleId}>{title}</h2>
          {aside}
          {onClose ? <button type="button" className="modal-close" aria-label={t.hud.modal.close} onClick={onClose}><Picto name="close" size={16} /></button> : null}
        </header>
        {tabs ? (
          <div className="modal-tabs" role="tablist" aria-labelledby={titleId} onKeyDown={onTabKey}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={(element) => {
                  if (element) tabRefs.current.set(tab.id, element);
                  else tabRefs.current.delete(tab.id);
                }}
                id={`${tabsId}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tabsId}-panel`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => onTab?.(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}
        {tabs ? (
          <div className="modal-body" id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${activeTab}`}>{children}</div>
        ) : (
          <div className="modal-body">{children}</div>
        )}
        {footer ? <footer className="modal-foot">{footer}</footer> : null}
      </div>
    </div>
  );
}

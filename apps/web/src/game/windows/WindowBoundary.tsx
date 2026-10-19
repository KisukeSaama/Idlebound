"use client";

import { catchError, type ErrorInfo } from "next/error";
import { useEffect } from "react";
import { useI18n } from "@/i18n/client";
import { reportClientError } from "@/lib/errorReport";
import { Modal } from "../components/Modal";

interface Props {
  /** Closes what broke: the window, the scene or the chest it stood for. */
  onClose: () => void;
}

/** What stands in a window that broke: the road goes on behind it, the walker closes it or tries again. */
function WindowFailed({ onClose, error, reset }: Props & { error: unknown; reset: () => void }) {
  const { t } = useI18n();
  const text = t.site.windowError;
  useEffect(() => reportClientError("window", error), [error]);
  return (
    <Modal
      title={text.title}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn" onClick={reset}>{text.retry}</button>
          <button type="button" className="btn btn-gold" onClick={onClose}>{text.close}</button>
        </>
      }
    >
      <p>{text.text}</p>
    </Modal>
  );
}

/**
 * Holds what a window, a scene or a chest throws while it renders: only that layer falls, in
 * its own small window, never the game behind it. `reset` draws it again as it is (the game's
 * state lives outside it), without asking the server anything.
 */
export const WindowBoundary = catchError<Props>((props, { error, reset }: ErrorInfo) => <WindowFailed {...props} error={error} reset={reset} />);

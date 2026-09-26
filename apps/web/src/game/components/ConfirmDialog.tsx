"use client";

import { useI18n } from "@/i18n/client";
import { Modal } from "./Modal";

export interface ConfirmRequest {
  title: string;
  text: string;
  confirmLabel: string;
  danger?: boolean;
  resolve: (confirmed: boolean) => void;
}

export function ConfirmDialog({ request, onDone }: { request: ConfirmRequest; onDone: () => void }) {
  const { t } = useI18n();
  const answer = (value: boolean) => {
    request.resolve(value);
    onDone();
  };
  return (
    <Modal
      title={request.title}
      size="sm"
      onClose={() => answer(false)}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => answer(false)}>{t.common.cancel}</button>
          <button type="button" className={`btn ${request.danger ? "btn-danger" : "btn-gold"}`} onClick={() => answer(true)}>{request.confirmLabel}</button>
        </>
      }
    >
      <p className="modal-text">{request.text}</p>
    </Modal>
  );
}

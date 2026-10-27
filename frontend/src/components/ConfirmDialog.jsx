import React, { useEffect, useId, useRef } from "react";
import { AlertTriangle, LoaderIcon } from "lucide-react";

/**
 * Styled, accessible replacement for window.confirm().
 * Uses the native <dialog> element (Esc to cancel, focus trapping, backdrop).
 */
const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const ref = useRef(null);
  const cancelRef = useRef(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const messageId = `${uid}-message`;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Focus the safe action by default
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal modal-bottom sm:modal-middle"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={(e) => {
        e.preventDefault();
        if (!loading) onCancel?.();
      }}
    >
      <div className="modal-box max-w-sm font-mono">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-full bg-error/15 p-3 text-error">
            <AlertTriangle className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 id={titleId} className="font-bold text-lg">
              {title}
            </h3>
            {message && (
              <p
                id={messageId}
                className="mt-1.5 text-sm text-base-content/70 break-words"
              >
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button
            ref={cancelRef}
            id={`${uid}-cancel`}
            className="btn btn-sm btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            id={`${uid}-confirm`}
            className="btn btn-sm btn-error min-w-24"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <LoaderIcon className="size-4 animate-spin" /> : confirmLabel}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => !loading && onCancel?.()}
        aria-hidden="true"
      />
    </dialog>
  );
};

export default ConfirmDialog;

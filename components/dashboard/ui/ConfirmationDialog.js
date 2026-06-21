"use client";

import { useState } from "react";
import { TriangleExclamation, CircleCheck, CircleXmark, TrashBin } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import Modal from "@/components/dashboard/ui/Modal";
import { cn, dashboardClasses } from "@/lib/dashboard/theme";

const VARIANT_CONFIG = {
  default: {
    icon: TriangleExclamation,
    iconBg: "bg-primary-container/15",
    iconColor: "text-primary",
  },
  danger: {
    icon: TrashBin,
    iconBg: "bg-error/15",
    iconColor: "text-error",
  },
  success: {
    icon: CircleCheck,
    iconBg: "bg-[#22C55E]/15",
    iconColor: "text-[#22C55E]",
  },
  warning: {
    icon: TriangleExclamation,
    iconBg: "bg-[#F59E0B]/15",
    iconColor: "text-[#F59E0B]",
  },
  reject: {
    icon: CircleXmark,
    iconBg: "bg-error/15",
    iconColor: "text-error",
  },
};

/**
 * Confirmation dialog built on top of Modal.
 * Used for delete, block, reject, approve confirmations.
 *
 * @example
 * <ConfirmationDialog
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   onConfirm={handleDelete}
 *   variant="danger"
 *   title="Delete class?"
 *   message="This action cannot be undone."
 * />
 */
export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  size = "sm",
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.default;

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose?.();
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose?.();
    } catch {
      // Keep dialog open; caller should toast the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? undefined : onClose}
      size={size}
      showCloseButton={!isLoading}
      closeOnOverlay={!isLoading}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={dashboardClasses.btnSecondary}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              variant === "danger" || variant === "reject"
                ? dashboardClasses.btnDanger
                : variant === "success"
                  ? dashboardClasses.btnPrimary
                  : dashboardClasses.btnPrimary
            )}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
            config.iconBg
          )}
        >
          <Icon icon={config.icon} className={config.iconColor} size={28} />
        </div>

        <div className="min-w-0">
          <h3 className="font-anybody text-lg font-bold text-white">{title}</h3>
          <p className="mt-2 font-hanken text-sm text-on-surface-variant">{message}</p>
        </div>
      </div>
    </Modal>
  );
}

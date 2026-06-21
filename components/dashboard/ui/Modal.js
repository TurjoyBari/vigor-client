"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Xmark } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { cn, dashboardClasses, DASHBOARD_ANIMATION } from "@/lib/dashboard/theme";

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-6xl",
};

/**
 * Reusable glass modal for dashboard dialogs.
 *
 * @example
 * <Modal isOpen={open} onClose={() => setOpen(false)} title="View Students">
 *   <StudentList />
 * </Modal>
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  showCloseButton = true,
  className = "",
  bodyClassName = "",
}) {
  const handleEscape = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "dashboard-modal-title" : undefined}
          aria-describedby={description ? "dashboard-modal-description" : undefined}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlay ? onClose : undefined}
            aria-label="Close modal overlay"
          />

          <motion.div
            className={cn(
              "relative w-full",
              SIZE_CLASSES[size],
              dashboardClasses.glassCard,
              "shadow-[0_24px_64px_rgba(0,0,0,0.45)]",
              className
            )}
            initial={DASHBOARD_ANIMATION.scaleIn.initial}
            animate={DASHBOARD_ANIMATION.scaleIn.animate}
            exit={DASHBOARD_ANIMATION.scaleIn.exit}
            transition={DASHBOARD_ANIMATION.scaleIn.transition}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between gap-4 border-b border-primary-container/15 px-5 py-4 md:px-6 md:py-5">
                <div className="min-w-0">
                  {title && (
                    <h2
                      id="dashboard-modal-title"
                      className="font-anybody text-xl font-bold text-white truncate"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="dashboard-modal-description"
                      className="mt-1 font-hanken text-sm text-on-surface-variant"
                    >
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                      dashboardClasses.btnGhost,
                      "h-9 w-9 shrink-0 rounded-xl p-0"
                    )}
                    aria-label="Close modal"
                  >
                    <Icon icon={Xmark} size={20} />
                  </button>
                )}
              </div>
            )}

            <div
              className={cn(
                "max-h-[calc(100vh-12rem)] overflow-y-auto px-5 py-4 md:px-6 md:py-5",
                bodyClassName
              )}
            >
              {children}
            </div>

            {footer && (
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-primary-container/15 px-5 py-4 md:px-6 md:py-5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRightFromSquare,
  Xmark,
} from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import Badge from "@/components/dashboard/ui/Badge";
import { authClient } from "@/lib/auth-client";
import {
  SIDEBAR_NAV,
  ROLE_LABELS,
  getRoleDashboardPath,
} from "@/lib/dashboard/navConfig";
import {
  cn,
  dashboardClasses,
  DASHBOARD_SPACING,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function NavLink({ item, pathname, collapsed, onNavigate }) {
  const isOverview = /^\/dashboard\/[^/]+$/.test(item.href);
  const active = isOverview
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
        active
          ? "bg-primary-container/20 text-white border border-primary-container/30 shadow-[0_0_16px_rgba(124,58,237,0.15)]"
          : "text-on-surface-variant hover:text-white hover:bg-primary-container/10 border border-transparent"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          active
            ? "bg-primary-container text-on-primary-container"
            : "bg-surface-container-high/80 text-on-surface-variant group-hover:text-primary"
        )}
      >
        <Icon icon={item.icon} size={18} />
      </span>

      {!collapsed && (
        <span className="min-w-0 flex-1">
          <span className="block font-geist-label text-label-bold truncate">
            {item.label}
          </span>
          {item.description && (
            <span className="block font-hanken text-[11px] text-on-surface-variant/80 truncate mt-0.5">
              {item.description}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

/**
 * Dashboard sidebar with role-based navigation.
 * Desktop: fixed + collapsible
 * Mobile: drawer overlay
 */
export default function Sidebar({
  role = "user",
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
  user,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = SIDEBAR_NAV[role] || SIDEBAR_NAV.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleNavigate = () => {
    onMobileClose?.();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={cn(
          "flex items-center border-b border-primary-container/15 px-4 py-5",
          collapsed ? "justify-center" : "justify-between gap-3"
        )}
      >
        <Link
          href={getRoleDashboardPath(role)}
          onClick={handleNavigate}
          className={cn("flex items-center gap-3 min-w-0", collapsed && "justify-center")}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container shadow-[0_0_20px_rgba(124,58,237,0.35)]">
            <span className="font-anybody text-sm font-black italic text-on-primary-container">
              V
            </span>
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="font-anybody text-lg font-black italic text-primary uppercase tracking-tight">
                VIGOR
              </p>
              <p className="font-hanken text-[11px] text-on-surface-variant truncate">
                {ROLE_LABELS[role]} Dashboard
              </p>
            </div>
          )}
        </Link>

        {mobileOpen && (
          <button
            type="button"
            onClick={onMobileClose}
            className={cn(dashboardClasses.btnGhost, "lg:hidden h-9 w-9 p-0 shrink-0")}
            aria-label="Close sidebar"
          >
            <Icon icon={Xmark} size={18} />
          </button>
        )}
      </div>

      {/* Role badge + user */}
      {!collapsed && user && (
        <div className="px-4 py-4 border-b border-primary-container/10">
          <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-3">
            <p className="font-geist-label text-label-bold text-white truncate">
              {user.name || "User"}
            </p>
            <p className="font-hanken text-[11px] text-on-surface-variant truncate mt-0.5">
              {user.email}
            </p>
            <div className="mt-2">
              <Badge role={role} size="sm" dot />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={DASHBOARD_ANIMATION.slideInLeft.initial}
            animate={DASHBOARD_ANIMATION.slideInLeft.animate}
            transition={{ delay: index * 0.04, duration: 0.25 }}
          >
            <NavLink
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </motion.div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-primary-container/15 p-3 space-y-2">
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              dashboardClasses.btnGhost,
              "hidden lg:flex w-full",
              collapsed ? "justify-center px-0" : "justify-start"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon icon={collapsed ? ChevronRight : ChevronLeft} size={18} />
            {!collapsed && (
              <span className="font-geist-label text-label-bold">Collapse</span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-error",
            "hover:bg-error/10 border border-transparent hover:border-error/20 transition-all duration-200",
            collapsed ? "justify-center" : "justify-start"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-error/10">
            <Icon icon={ArrowRightFromSquare} size={18} />
          </span>
          {!collapsed && (
            <span className="font-geist-label text-label-bold">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            aria-label="Close sidebar overlay"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <motion.aside
        className={cn(
          dashboardClasses.sidebar,
          "w-[280px] lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        initial={false}
        animate={{ x: mobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Desktop sidebar */}
      <motion.aside
        className={cn(
          dashboardClasses.sidebar,
          "hidden lg:flex transition-[width] duration-300",
          collapsed ? "w-[80px]" : "w-[280px]"
        )}
        style={{
          width: collapsed
            ? DASHBOARD_SPACING.sidebarCollapsedWidth
            : DASHBOARD_SPACING.sidebarWidth,
        }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}

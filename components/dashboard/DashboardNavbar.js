"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars,
  Bell,
  Magnifier,
  Moon,
  Sun,
  Person,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import Badge from "@/components/dashboard/ui/Badge";
import { authClient } from "@/lib/auth-client";
import { logoutBackend } from "@/lib/dashboard/api";
import {
  getDashboardPageTitle,
  getRoleDashboardPath,
  DASHBOARD_SEARCH_PLACEHOLDER,
} from "@/lib/dashboard/navConfig";
import { cn, dashboardClasses } from "@/lib/dashboard/theme";

function UserAvatar({ user, size = 36 }) {
  if (
    user?.image &&
    !user.image.startsWith("blob:") &&
    !user.image.startsWith("data:")
  ) {
    return (
      <Image
        width={size}
        height={size}
        className="rounded-full object-cover border-2 border-primary-container/40"
        src={user.image}
        alt={user.name || "User avatar"}
      />
    );
  }

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.name || "User avatar"}
        className="rounded-full object-cover border-2 border-primary-container/40"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full border-2 border-primary-container/40 bg-primary-container flex items-center justify-center text-on-primary-container font-bold"
      style={{ width: size, height: size }}
    >
      {(user?.name || "U").charAt(0).toUpperCase()}
    </div>
  );
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Class reminder",
    message: "HIIT Power Hour starts in 1 hour.",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    title: "New enrollment",
    message: "A student joined your Yoga Flow class.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Payment received",
    message: "Your subscription payment was successful.",
    time: "1d ago",
    unread: false,
  },
];

/**
 * Dashboard top navbar with search, notifications, theme toggle, and user menu.
 */
export default function DashboardNavbar({
  role = "user",
  user,
  onMenuClick,
  searchValue = "",
  onSearchChange,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getDashboardPageTitle(role, pathname);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleLogout = async () => {
    await logoutBackend();
    await authClient.signOut();
    router.push("/");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  return (
    <header className={dashboardClasses.navbar}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onMenuClick}
          className={cn(dashboardClasses.btnGhost, "lg:hidden h-10 w-10 p-0 shrink-0")}
          aria-label="Open sidebar menu"
        >
          <Icon icon={Bars} size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="font-anybody text-lg md:text-xl font-bold text-white truncate">
            {pageTitle}
          </h1>
          <p className="hidden sm:block font-hanken text-xs text-on-surface-variant truncate">
            VIGOR Dashboard
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Icon
            icon={Magnifier}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            size={18}
          />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={DASHBOARD_SEARCH_PLACEHOLDER[role]}
            className={cn(dashboardClasses.input, "pl-10 py-2.5")}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserMenuOpen(false);
            }}
            className={cn(
              dashboardClasses.btnGhost,
              "relative h-10 w-10 p-0 rounded-xl"
            )}
            aria-label="Notifications"
          >
            <Icon icon={Bell} size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 rounded-[20px] border border-primary-container/20 bg-[#0B1120]/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.45)] z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-primary-container/15">
                  <p className="font-geist-label text-label-bold text-white">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="font-hanken text-xs text-secondary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "px-4 py-3 border-b border-primary-container/10 last:border-0",
                        item.unread && "bg-primary-container/5"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-geist-label text-sm font-semibold text-white">
                          {item.title}
                        </p>
                        {item.unread && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                        )}
                      </div>
                      <p className="mt-1 font-hanken text-xs text-on-surface-variant">
                        {item.message}
                      </p>
                      <p className="mt-1 font-hanken text-[10px] text-on-surface-variant/70">
                        {item.time}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className={cn(dashboardClasses.btnGhost, "h-10 w-10 p-0 rounded-xl")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <Icon icon={isDark ? Sun : Moon} size={20} />
        </button>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotifOpen(false);
            }}
            className="rounded-full transition-transform hover:scale-105 focus:outline-none"
            aria-label="User menu"
          >
            <UserAvatar user={user} size={36} />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-60 rounded-[20px] border border-primary-container/20 bg-[#0B1120]/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.45)] z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-primary-container/15">
                  <p className="font-geist-label text-sm font-bold text-white truncate">
                    {user?.name}
                  </p>
                  <p className="font-hanken text-xs text-on-surface-variant truncate mt-0.5">
                    {user?.email}
                  </p>
                  <div className="mt-2">
                    <Badge role={role} size="sm" dot />
                  </div>
                </div>

                <Link
                  href={`/dashboard/${role}/profile`}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 font-hanken text-sm text-on-surface-variant hover:text-white hover:bg-primary-container/10 transition"
                >
                  <Icon icon={Person} size={16} />
                  Profile Settings
                </Link>

                <Link
                  href={getRoleDashboardPath(role)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 font-hanken text-sm text-on-surface-variant hover:text-white hover:bg-primary-container/10 transition"
                >
                  <Icon icon={Magnifier} size={16} />
                  Dashboard Home
                </Link>

                <div className="border-t border-primary-container/15">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-3 font-hanken text-sm text-error hover:bg-error/10 transition"
                  >
                    <Icon icon={ArrowRightFromSquare} size={16} />
                    Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

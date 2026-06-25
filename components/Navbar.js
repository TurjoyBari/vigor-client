"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Moon, Sun } from "@gravity-ui/icons";
import { FaThLarge, FaUser, FaSignOutAlt } from "react-icons/fa";
import Icon from "./Icon";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { logoutBackend } from "@/lib/dashboard/api";


export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutBackend();
    await authClient.signOut();
    router.push("/");
  };


  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-primary-container/30 bg-nav-bg/95 shadow-[0_4px_30px_rgba(124,58,237,0.15)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-margin-mobile md:px-margin-desktop h-24 w-full max-w-container-max">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-anybody text-headline-md font-black tracking-tighter text-primary italic"
          >
            VIGOR
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className={`font-anybody text-label-bold uppercase tracking-[0.2em] transition-colors ${pathname === "/"
                ? "text-primary border-b-2 border-primary-container pb-1"
                : "text-on-surface hover:text-primary"
              }`}
          >
            Home
          </Link>
          <Link
            href="/all-classes"
            className={`font-anybody text-label-bold uppercase tracking-[0.2em] transition-colors ${pathname.startsWith("/all-classes") || pathname.startsWith("/classes")
                ? "text-primary border-b-2 border-primary-container pb-1"
                : "text-on-surface hover:text-primary"
              }`}
          >
            All Classes
          </Link>
          <Link
            href="/community-forum"
            className={`font-anybody text-label-bold uppercase tracking-[0.2em] transition-colors ${pathname.startsWith("/community") || pathname.startsWith("/forum")
                ? "text-primary border-b-2 border-primary-container pb-1"
                : "text-on-surface hover:text-primary"
              }`}
          >
            Community Forum
          </Link>
          {session && session?.user && (
            <Link
              href={`/dashboard/${session?.user?.role}`}
              className={`font-anybody text-label-bold uppercase tracking-[0.2em] transition-colors ${pathname.startsWith("/dashboard") ? "text-pink-500 font-semibold" : "text-slate-300 hover:text-white"}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">


          {!session && (
            <div className="flex items-center gap-4 md:gap-8">
                <Button
                   isIconOnly
                   variant="secondary"
                   className="rounded-xl border border-primary-container/30 bg-primary-container/10 hover:bg-primary-container/20 min-w-10 h-10"
                   aria-label="Toggle theme"
                          >
                <Icon icon={Moon} className="text-primary" size={20} />
              </Button>
              <Link href="/login">
                <button
                  className="hidden sm:inline text-on-surface font-anybody text-label-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Login
                </button>
              </Link>
              <Link
                href="/register"
                className="bg-primary-container hover:brightness-110 text-on-primary-container px-6 md:px-8 py-3 rounded-xl font-anybody text-label-bold uppercase tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                Sign Up
              </Link>
            </div>
          )}

          {session && session?.user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center transition-transform hover:scale-105 outline-none focus:outline-none cursor-pointer"
              >
                {session.user.image &&
                !session.user.image.startsWith("blob:") &&
                !session.user.image.startsWith("data:") ? (
                  <Image
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border border-pink-500 shadow-md shadow-pink-500/10"
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                  />
                ) : session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                    className="w-9 h-9 rounded-full object-cover border border-pink-500 shadow-md shadow-pink-500/10"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full border border-pink-500 shadow-md shadow-pink-500/10 bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                    {(session.user.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl py-2 z-55 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User info */}
                  <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 cursor-default">
                    <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                      {session.user.role} Account
                    </p>
                    <p className="font-bold text-white text-sm mt-0.5">{session.user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{session.user.email}</p>
                  </div>

                  {/* Actions */}
                  <Link
                    href={`/dashboard/${session?.user?.role}`}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaThLarge className="text-slate-400 text-sm shrink-0" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href={`/dashboard/${session.user.role}/profile`}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaUser className="text-slate-400 text-sm shrink-0" />
                    <span>Profile Settings</span>
                  </Link>

                  <div className="border-t border-white/5 my-1.5" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition cursor-pointer"
                  >
                    <FaSignOutAlt className="text-sm shrink-0 text-red-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}

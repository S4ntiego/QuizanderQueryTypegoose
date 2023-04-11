"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { logoutUserFn } from "src/api/authApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useStateContext } from "src/context";

import { cn } from "../lib/utils";
import { siteConfig } from "../config/site";
import { dashboardConfig } from "src/config/dashboard";
import { Icons } from "./Icons";

interface MainNavProps {
  children?: React.ReactNode;
}

export function MainNav({ children }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const stateContext = useStateContext();
  const user = stateContext.state.authUser;

  const { mutate: logoutUser, isLoading } = useMutation(
    async () => await logoutUserFn(),
    {
      onSuccess: (data) => {
        window.location.href = "/login";
      },
      onError: (error: any) => {
        if (Array.isArray(error.response.data.error)) {
          error.data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: "top-right",
            })
          );
        } else {
          toast.error(error.response.data.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  const logoutHandler = async () => {
    logoutUser();
  };

  return (
    <header className="container sticky top-0 z-40 bg-white">
      <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Icons.logo />
            <span className="hidden font-playfair font-black sm:inline-block">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden gap-6 md:flex">
            {dashboardConfig.mainNav.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center text-lg font-semibold text-slate-600 sm:text-sm",
                  item.href.startsWith(`/${segment}`) && "text-slate-900"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <button
            className="flex items-center space-x-2 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <Icons.close /> : <Icons.logo />}
            <span className="font-bold">Menu</span>
          </button>
          {/* {showMobileMenu && <MobileNav items={items}>{children}</MobileNav>} */}
        </div>
        <div className={cn("flex gap-6 md:gap-10")}>
          {!user && (
            <Link
              href="/login"
              className="relative inline-flex h-8 items-center rounded-md border border-transparent bg-slate-900 px-6 py-1 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
            >
              Login
            </Link>
          )}
          {user && user?.role === "admin" && (
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center text-lg font-semibold text-slate-600 sm:text-sm"
              )}
            >
              Dashboard
            </Link>
          )}
          {user && (
            <>
              <Link
                href="/profile"
                className={cn(
                  "flex items-center text-lg font-semibold text-slate-600 sm:text-sm"
                )}
              >
                <Icons.user />
              </Link>
              <Link
                href="/"
                onClick={() => logoutHandler()}
                className="relative inline-flex h-8 items-center rounded-md border border-transparent bg-slate-900 px-6 py-1 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
              >
                Logout
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

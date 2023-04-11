"use client";

import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";
import { Playfair_Display } from "@next/font/google";
import { Domine } from "@next/font/google";
import { Fraunces } from "@next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StateContextProvider } from "../context/index";
import AuthMiddleware from "src/middleware/AuthMiddleware";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10000,
    },
  },
});

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const domine = Domine({
  subsets: ["latin"],
  variable: "--font-domine",
  display: "optional",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "optional",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <html
      className={`${playfair.variable} ${domine.variable} ${fraunces.variable} bg-white font-sans text-slate-900 antialiased" lang="en`}
    >
      <head />
      <body className="min-h-screen">
        <QueryClientProvider client={queryClient}>
          <StateContextProvider>
            <AuthMiddleware>{children}</AuthMiddleware>
          </StateContextProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}

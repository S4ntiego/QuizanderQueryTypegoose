import React from "react";
import { MainNav } from "../../components/MainNav";
import { SiteFooter } from "../../components/SiteFooter";

interface QuizzesProps {
  children: React.ReactNode;
}

const layout = ({ children }: QuizzesProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default layout;

import { DashboardConfig } from "../types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Quizzes",
      href: "/",
    },
    {
      title: "Harrivia",
      href: "/",
    },
  ],
  sidebarNav: [
    {
      title: "Quizzes",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Pages",
      href: "/dashboard/pages",
      icon: "page",
    },
    {
      title: "Media",
      href: "/dashboard/media",
      icon: "media",
    },
    {
      title: "User",
      href: "/dashboard/user",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};

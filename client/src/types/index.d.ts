import { Icons } from "@/components/icons";
import type { Icon } from "lucide-react";

//USER

export interface IUser {
  name: string;
  email: string;
  role: string;
  photo: string;
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GenericResponse {
  status: string;
  message: string;
}

export interface ILoginResponse {
  status: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: IUser;
  };
}

//QUIZZES

export interface IQuizRequest {
  title: string;
  description: string;
  coverImage: string;
  category: string;
  createdBy: string;
}

export interface IQuizResponse {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  createdBy: IUser;
  created_at: string;
  updated_at: string;
}

export interface IQuizzesResponse {
  status: string;
  data: {
    quizzes: IQuizResponse[];
  };
}

// CONFIG && NAVBAR && FOOTER

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type SiteConfig = {
  name: string;
  links: {
    linkedIn: string;
    github: string;
  };
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

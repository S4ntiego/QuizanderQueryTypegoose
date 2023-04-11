"use client";

import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { getMeFn } from "../api/authApi";
import { useStateContext } from "../context";
import React from "react";

type AuthMiddlewareProps = {
  children: React.ReactElement;
};

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [cookies] = useCookies(["logged_in"]);
  const stateContext = useStateContext();

  const query = useQuery(["authUser"], () => getMeFn(), {
    enabled: !!cookies.logged_in,
    select: (data) => data.data.user,
    onSuccess: (data) => {
      stateContext.dispatch({ type: "SET_USER", payload: data });
    },
  });

  return children;
};

export default AuthMiddleware;

import * as React from "react";
import {useRouter} from "next/router";
import {useUser} from "../hooks/user";

const Auth = ({children}) => {
  const router = useRouter();
  const {user, loading} = useUser();

  // if loading, show loading indicator
  if (loading) return <>Loading...</>;
  // if user is unauthenticated, redirect to signin page
  if (!loading && !user) router.push("/auth/signin");
  // if user is authenticated, show children
  if (!loading && user) return <>{children}</>;
  // fallback
  return null;
};

export {Auth};

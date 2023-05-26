import { ReactNode, useEffect, useState } from "react";
import RestClient from "../misc/RestClient";
import { useNavigate } from "react-router-dom";

export interface ProtectedRouteProps {
  Child: () => JSX.Element
};

const ProtectedRoute = ({ Child }: ProtectedRouteProps) => {
  const [signOut, setSignOut] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => await RestClient.checkUser().then((res: boolean) => setSignOut(res));
    checkUser();
  }, [Child]);

  useEffect(() => { if (signOut) navigate("/login"); }, [signOut]);

  return signOut ? null : <Child />;
};

export default ProtectedRoute;
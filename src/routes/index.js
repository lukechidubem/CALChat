import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import MainLayout from "../layouts/main";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

//  "/app"

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <MainLayout />,
      children: [
        { element: <LoginPage />, path: "login" },
        { element: <RegisterPage />, path: "register" },
        { element: <ResetPasswordPage />, path: "reset-password" },
        { element: <NewPasswordPage />, path: "new-password/:token" },
        { path: "verify", element: <VerifyPage /> },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "call", element: <CallPage /> },
        { path: "group", element: <GroupPage /> },
        { path: "profile", element: <Profile /> },
        { path: "chats", element: <Chats /> },

        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp"))
);
const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(
  lazy(() => import("../pages/auth/ResetPassword"))
);
const NewPasswordPage = Loadable(
  lazy(() => import("../pages/auth/NewPassword"))
);
const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));

const Chats = Loadable(lazy(() => import("../pages/dashboard/Chats")));
const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));
const GroupPage = Loadable(
  lazy(() => import("../pages/dashboard/GroupGeneralApp"))
);

const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
const Profile = Loadable(
  lazy(() => import("../pages/dashboard/Settings/Profile"))
);

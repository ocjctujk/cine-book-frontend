import Home from "../pages/Home";
import Movies from "../pages/Movies";
import SeatSelection from "../pages/SeatSelection";
import Shows from "../pages/Shows";
import type { ReactNode } from "react";
import Bookings from "../pages/Bookings";
import AuthPage from "../pages/AuthPage";
import Payment from "../pages/Payment";

type Route = {
  path: string;
  element: ReactNode;
};

export const publicRoutes: Route[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/movies",
    element: <Movies />,
  },
  {
    path: "shows/:id",
    element: <Shows />,
  },
  {
    path: "/shows/seats/:id",
    element: <SeatSelection />,
  },
];
export const protectedRoutes: Route[] = [
  {
    path: "/payment/:id",
    element: <Payment />,
  },
  {
    path: "/bookings",
    element: <Bookings />,
  },
];

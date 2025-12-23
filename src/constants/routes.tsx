import Home from "../pages/Home";
import Movies from "../pages/Movies";
import SeatSelection from "../pages/SeatSelection";
import Shows from "../pages/Shows";
import type { ReactNode } from "react";
import Bookings from "../pages/Bookings";
import AuthPage from "../pages/AuthPage";
import Payment from "../pages/Payment";
import Profile from "../pages/Profile";
import type { UserRole } from "../components/ProtectedRoute";
import { UserRoles } from "./constants";
import Venues from "../pages/admin/Venues";
import VenueShows from "../pages/admin/VenueShows";
import AdminMovies from "../pages/admin/Movies";
import MovieDetail from "../pages/admin/MovieDetail";
import SuperAdminMovies from "../pages/superadmin/Movies";
import AddMoviePage from "../pages/superadmin/AddMovie";

type Route = {
  path: string;
  element: ReactNode;
  requiredRoles: UserRole[];
};

export const publicRoutes = [
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
    requiredRoles: [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.USER],
  },
  {
    path: "/bookings",
    element: <Bookings />,
    requiredRoles: [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.USER],
  },
  {
    path: "/profile",
    element: <Profile />,
    requiredRoles: [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.USER],
  },
  {
    path: "/venues",
    element: <Venues />,
    requiredRoles: [UserRoles.ADMIN],
  },
  {
    path: "/venues/venueshows/:id",
    element: <VenueShows />,
    requiredRoles: [UserRoles.ADMIN],
  },
  {
    path: "/admin/movies",
    element: <AdminMovies />,
    requiredRoles: [UserRoles.ADMIN],
  },
  {
    path: "/admin/movies/:id",
    element: <MovieDetail />,
    requiredRoles: [UserRoles.ADMIN],
  },
  {
    path: "/superadmin/movies",
    element: <SuperAdminMovies />,
    requiredRoles: [UserRoles.SUPERADMIN],
  },
  {
    path: "/superadmin/movies/add",
    element: <AddMoviePage />,
    requiredRoles: [UserRoles.SUPERADMIN],
  },
];

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";
import { useAuth } from "../context/useAuth";

export default function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const baseNavItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movies" },
    { label: "Bookings", path: "/bookings" },
  ];
  const authNavItem = user
    ? {
        label: "Logout",
        path: "#",
      }
    : {
        label: "Login",
        path: "/login",
      };
  const navItems = [...baseNavItems, authNavItem];

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <MovieIcon sx={{ display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: "auto",
              fontWeight: "bold",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Cine-Book
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {baseNavItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: "inherit",
                  textDecoration:
                    location.pathname === item.path ? "underline" : "none",
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              onClick={logout}
              sx={{
                color: "inherit",
                textDecoration:
                  location.pathname === authNavItem.path ? "underline" : "none",
                fontWeight:
                  location.pathname === authNavItem.path ? "bold" : "normal",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {authNavItem.label}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

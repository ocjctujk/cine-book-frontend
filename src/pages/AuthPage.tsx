// src/pages/AuthPage.tsx
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Layout from "../components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        // === SIGNUP ===
        const response = await fetch("http://localhost:3000/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle specific backend errors
          if (response.status === 409) {
            setError(
              "This email is already registered. Please use a different email."
            );
          } else if (response.status === 400) {
            setError(data.message || "Invalid data. Please check your inputs.");
          } else if (response.status >= 500) {
            setError("Server error. Please try again later.");
          } else {
            setError(data.message || "Signup failed. Please try again.");
          }
          return;
        }

        // Success
        // login({ email: data.email }, data.token);
      } else {
        // === LOGIN ===
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            setError("Invalid email or password.");
          } else if (response.status === 400) {
            setError("Please provide both email and password.");
          } else if (response.status >= 500) {
            setError("Server error. Please try again later.");
          } else {
            setError(data.message || "Login failed. Please try again.");
          }
          return;
        }

        // Success
        login(data.user, data.token);
      }

      // Redirect after success
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      // Network or unexpected errors
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError(
          "Unable to connect to server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          {isSignup ? "Create Account" : "Sign In"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%", maxWidth: 500 }}
        >
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {isSignup && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                name="firstName"
                required
                fullWidth
                label="First Name"
                autoFocus={!formData.email}
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                name="lastName"
                required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
              />
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  name="email"
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  name="password"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  name="dob"
                  fullWidth
                  label="Date of Birth (YYYY-MM-DD)"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="1990-05-15"
                  disabled={loading}
                />
              </Box>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  name="address_line_1"
                  fullWidth
                  label="Address Line 1"
                  value={formData.address_line_1}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  name="address_line_2"
                  fullWidth
                  label="Address Line 2 (Optional)"
                  value={formData.address_line_2}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
              <TextField
                name="city"
                fullWidth
                label="City"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  name="state"
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  name="pincode"
                  fullWidth
                  label="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
            </Box>
          )}

          {!isSignup && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                setIsSignup(!isSignup);
                setError(null);
              }}
              type="button"
              disabled={loading}
            >
              {isSignup
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default AuthPage;

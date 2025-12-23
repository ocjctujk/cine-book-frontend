import Layout from "../components/Layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  TextField,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Alert,
  LinearProgress,
  Stack,
  Chip,
  InputAdornment,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useAuth } from "../context/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ShowData } from "./SeatSelection";
import { CHARGES } from "../constants/constants";
import ConfirmationModal from "../components/ConfirmationModal";

interface SeatData {
  id: number;
  name: string;
  columnLetter: string;
  rowNumber: string;
  available: boolean;
}

const Payment = () => {
  const { user, token } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const showId = params.id;

  const [showData, setShowData] = useState<ShowData | null>(null);
  const [seatData, setSeatData] = useState<SeatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState<number>(0);

  const selectedSeats: number[] = JSON.parse(
    localStorage.getItem("seats") ?? "[]"
  );

  useEffect(() => {
    const fetchShowData = async () => {
      if (!showId) return;

      try {
        const [showRes, seatsRes] = await Promise.all([
          fetch(`http://localhost:3000/shows/${showId}`),
          fetch("http://localhost:3000/seats/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedSeats }),
          }),
        ]);

        if (!showRes.ok || !seatsRes.ok) {
          throw new Error("Failed to load booking details");
        }

        const show = await showRes.json();
        const seats = await seatsRes.json();

        setShowData(show);
        setSeatData(seats);

        const subtotal = seats.length * parseFloat(show.cost);
        const tax = (subtotal * CHARGES.tax) / 100;
        const totalAmount = subtotal + tax + CHARGES.convenience_fee;
        setTotal(totalAmount);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [showId]);

  const bookTickets = async () => {
    if (!showData || !total) return;

    const payload = {
      amount: total,
      showId: showData.id,
      userId: user?.id,
      seatIds: selectedSeats,
    };

    try {
      const response = await fetch("http://localhost:3000/booking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Booking failed");
      }

      alert("Tickets booked successfully!");
      localStorage.removeItem("seats");
      navigate("/bookings");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to book tickets");
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 10 }}>
        <LinearProgress />
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 4, color: "text.secondary" }}
        >
          Preparing your payment...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!showData || seatData.length === 0) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="warning">
          No booking details found. Please select seats again.
        </Alert>
      </Container>
    );
  }

  return (
    <Layout>
      <ConfirmationModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          localStorage.removeItem("seats");
          navigate(`/shows/${showData.movie.id}`);
        }}
        title="Cancel Booking?"
        message="Are you sure you want to cancel? Your selected seats will be released."
      />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 5, color: "primary.main" }}
        >
          Complete Your Booking
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="flex-start"
        >
          {/* Payment Form - Left on desktop, bottom on mobile */}
          <Box sx={{ flex: { md: 2 }, width: "100%", order: { xs: 2, md: 1 } }}>
            <Card elevation={8} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* User Details */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", mb: 3 }}
                >
                  <PersonIcon sx={{ mr: 1.5, color: "primary.main" }} />
                  Your Details
                </Typography>

                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={`${user?.firstName || ""} ${
                      user?.lastName || ""
                    }`.trim()}
                    InputProps={{ readOnly: true }}
                    variant="filled"
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user?.email || ""}
                      InputProps={{ readOnly: true }}
                      variant="filled"
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={user?.phone || "Not provided"}
                      InputProps={{ readOnly: true }}
                      variant="filled"
                    />
                  </Stack>
                </Stack>

                {/* Payment Details */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mt: 5, mb: 3, display: "flex", alignItems: "center" }}
                >
                  <CreditCardIcon sx={{ mr: 1.5, color: "primary.main" }} />
                  Payment Information
                </Typography>

                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    required
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="CVV"
                      type="password"
                      required
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                {/* Action Buttons */}
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={2}
                  sx={{ mt: 6 }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={() => setOpen(true)}
                    sx={{ px: 4, minWidth: 140 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={bookTickets}
                    startIcon={<LockIcon />}
                    sx={{
                      px: 5,
                      minWidth: 180,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      boxShadow: 4,
                    }}
                  >
                    Pay ₹{total?.toFixed(2)}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Booking Summary - Right on desktop, top on mobile */}
          <Box sx={{ flex: { md: 1 }, width: "100%", order: { xs: 1, md: 2 } }}>
            <Card
              elevation={8}
              sx={{ borderRadius: 3, position: "sticky", top: 24 }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" gutterBottom>
                  Booking Summary
                </Typography>
                <Divider sx={{ my: 2 }} />

                {/* Movie Info */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Avatar
                    src={showData.movie.poster_url}
                    variant="rounded"
                    sx={{ width: 90, height: 130, borderRadius: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {showData.movie.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {showData.venue.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(showData.time).toLocaleString()}
                    </Typography>
                    <Chip
                      label={`${seatData.length} Ticket${
                        seatData.length > 1 ? "s" : ""
                      }`}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Seats */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <EventSeatIcon sx={{ mr: 1, fontSize: 20 }} />
                    Selected Seats
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {seatData.map((seat) => seat.name).join(", ")}
                  </Typography>
                </Box>

                {/* Price Breakdown */}
                <List disablePadding>
                  <ListItem disablePadding sx={{ py: 0.8 }}>
                    <ListItemText
                      primary={`Tickets (${seatData.length} × ₹${showData.cost})`}
                    />
                    <Typography variant="body1">
                      ₹{showData.cost * seatData.length}
                    </Typography>
                  </ListItem>
                  <ListItem disablePadding sx={{ py: 0.8 }}>
                    <ListItemText primary="Convenience Fee" />
                    <Typography variant="body1">
                      ₹{CHARGES.convenience_fee}
                    </Typography>
                  </ListItem>
                  <ListItem disablePadding sx={{ py: 0.8 }}>
                    <ListItemText primary={`Taxes (${CHARGES.tax}%)`} />
                    <Typography variant="body1">
                      ₹
                      {(
                        (showData.cost * seatData.length * CHARGES.tax) /
                        100
                      ).toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                {/* Total */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    ₹{total?.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Payment;

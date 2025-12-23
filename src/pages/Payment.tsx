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
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
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
  const [total, setTotal] = useState<number>();

  const selectedSeats = JSON.parse(localStorage.getItem("seats") ?? "[]");
  console.log(selectedSeats);
  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/shows/${showId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch shows");
        }

        const data = await res.json();
        setShowData(data);
        const res2 = await fetch("http://localhost:3000/seats/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: [...selectedSeats] }),
        });

        if (!res2.ok) {
          throw new Error("Failed to fetch shows");
        }

        const data2 = await res2.json();
        setSeatData(data2);
        if (data2 && data && data.cost) {
          const totalPrice = parseInt(data2.length) * parseFloat(data.cost);
          const tax = (totalPrice * CHARGES.tax) / 100;
          const total = totalPrice + tax + CHARGES.convenience_fee;
          setTotal(total);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (showId) fetchShowData();
  }, [showId]);

  const bookTickets = async () => {
    const payload = {
      amount: total,
      showId: showData?.id,
      userId: user?.id,
      seatIds: [...selectedSeats],
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
        // response.ok is false for status codes like 401, 404, 500, etc.
        const errorData = await response.json().catch(() => ({})); // Try to parse error details
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      alert("Tickets booked successfully");
    } catch (error) {
      alert(error.message ?? "Failed to book the tickets");
    }
  };
  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 8 }}>
        <LinearProgress />
        <Typography align="center" sx={{ mt: 4 }}>
          Loading show details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  if (!showData) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography align="center">No show data found</Typography>
      </Container>
    );
  }
  return (
    <Layout>
      <ConfirmationModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          // perform the actual cancellation logic
          localStorage.removeItem("seats");
          navigate(`/shows/${showData.movie.id}`);
        }}
        onCancel={() => {}}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Complete Your Payment
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Booking Summary - Right side on desktop, top on mobile */}
          <Box
            sx={{
              flex: { xs: "0 0 100%", md: "0 0 33.333%" },
              order: { xs: 1, md: 2 },
            }}
          >
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Booking Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={showData.movie.poster_url}
                    variant="rounded"
                    sx={{ width: 80, height: 120, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">{showData.movie.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {showData.venue.name}
                    </Typography>
                    <Typography variant="body2">{showData.time}</Typography>
                  </Box>
                </Box>

                <List>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar>
                        <EventSeatIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Seats"
                      secondary={seatData.map((seat) => seat.name).join(", ")}
                    />
                  </ListItem>

                  <ListItem disablePadding sx={{ mt: 2 }}>
                    <ListItemText
                      primary={`Ticket Price x ${seatData.length}`}
                    />
                    <Typography variant="body1">
                      ₹{showData.cost * seatData.length}
                    </Typography>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText primary="Convenience Fee" />
                    <Typography variant="body1">
                      ₹{CHARGES.convenience_fee}
                    </Typography>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText primary="Taxes" />
                    <Typography variant="body1">
                      ₹{(CHARGES.tax * (showData.cost * seatData.length)) / 100}
                    </Typography>
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{total}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Payment Form & User Info - Left side on desktop */}
          <Box
            sx={{
              flex: { xs: "0 0 100%", md: "0 0 66.666%" },
              order: { xs: 2, md: 1 },
            }}
          >
            <Card elevation={4}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <PersonIcon sx={{ mr: 1 }} /> User Details
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: { xs: "0 0 100%", sm: "0 0 50%" } }}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={`${user?.firstName} ${user?.lastName}`}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ flex: { xs: "0 0 100%", sm: "0 0 50%" } }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user?.email}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ flex: "0 0 100%" }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={user?.phone ?? ""}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mt: 4, display: "flex", alignItems: "center" }}
                >
                  <CreditCardIcon sx={{ mr: 1 }} /> Payment Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      variant="outlined"
                      required
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      variant="outlined"
                      required
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: "0 0 50%" }}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        placeholder="MM/YY"
                        variant="outlined"
                        required
                      />
                    </Box>
                    <Box sx={{ flex: "0 0 50%" }}>
                      <TextField
                        fullWidth
                        label="CVV"
                        type="password"
                        variant="outlined"
                        required
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 4, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    sx={{ px: 6, mx: 2 }}
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ px: 6 }}
                    onClick={bookTickets}
                  >
                    Pay ₹{total}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Payment;

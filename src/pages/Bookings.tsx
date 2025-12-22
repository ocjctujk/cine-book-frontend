import {
  Typography,
  Box,
  Paper,
  Button,
  LinearProgress,
  Container,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import type { ShowData } from "./SeatSelection";
import { useAuth } from "../context/useAuth";

type Seat = {
  id: number;
  name: string;
  columnLetter: string;
  rowNumber: number;
};

type BookingShow = ShowData & {
  seats?: Seat[];
};

type BookingData = {
  id: number;
  amount: string; // or number, but sample has string
  show: BookingShow;
  seats: Seat[];
};

export default function Bookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData[]>([]); // Changed to array for multiple bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/booking/${user.id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await res.json();
        // Assuming API returns array; if single, wrap in array
        setBookingData(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [user]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ width: "100%", mt: 8 }}>
          <LinearProgress />
          <Typography align="center" sx={{ mt: 4 }}>
            Loading your bookings...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Alert severity="error">Error: {error}</Alert>
        </Container>
      </Layout>
    );
  }

  if (bookingData.length === 0) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            My Bookings
          </Typography>

          <Box sx={{ mt: 8, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No bookings yet
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Start exploring movies and book tickets for your favorite shows!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/movies")}
              sx={{ mt: 3 }}
            >
              Browse Movies
            </Button>
          </Box>

          <Paper sx={{ p: 4, mt: 8, backgroundColor: "#f9f9f9" }}>
            <Typography variant="h6" gutterBottom>
              How to Book Tickets
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body1">
                1. Browse available movies
              </Typography>
              <Typography variant="body1">
                2. Select show time and cinema
              </Typography>
              <Typography variant="body1">
                3. Choose seats and complete payment
              </Typography>
              <Typography variant="body1">4. Get your confirmation!</Typography>
            </Stack>
          </Paper>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings ({bookingData.length})
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {bookingData.map((booking) => {
            const { show } = booking;
            const { seats } = booking;
            const numTickets = seats.length;
            const posterUrl =
              show.movie.poster_url || "/placeholder-poster.jpg";

            return (
              <Box key={booking.id}>
                <Card elevation={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <Box sx={{ flex: { xs: "0 0 100%", md: "0 0 33.333%" } }}>
                      <CardMedia
                        component="img"
                        image={posterUrl}
                        alt={show.movie.name}
                        sx={{
                          height: { xs: 300, md: "100%" },
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: { xs: "0 0 100%", md: "0 0 66.666%" } }}>
                      <CardContent sx={{ height: "100%" }}>
                        <Typography variant="h5" gutterBottom>
                          {show.movie.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          paragraph
                        >
                          {show.movie.description}
                        </Typography>

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          sx={{ my: 2 }}
                        >
                          <Chip
                            label={`Duration: ${show.movie.duration} min`}
                          />
                          <Chip
                            label={`Tickets: ${numTickets}`}
                            color="primary"
                          />
                          <Chip
                            label={`Total: ₹${booking.amount}`}
                            color="secondary"
                          />
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            my: 2,
                          }}
                        >
                          <Box sx={{ flex: { xs: "0 0 100%", sm: "0 0 50%" } }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Show Details
                            </Typography>
                            <Typography>
                              Date: {formatDate(show.time)}
                            </Typography>
                            <Typography>
                              Time: {formatTime(show.time)}
                            </Typography>
                            <Typography>Screen: {show.screen.name}</Typography>
                          </Box>
                          <Box sx={{ flex: { xs: "0 0 100%", sm: "0 0 50%" } }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Venue
                            </Typography>
                            <Typography>{show.venue.name}</Typography>
                            <Typography>{show.venue.address_line_1}</Typography>
                            {show.venue.address_line_2 && (
                              <Typography>
                                {show.venue.address_line_2}
                              </Typography>
                            )}
                            <Typography>
                              {show.venue.city}, {show.venue.state}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Selected Seats
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {seats.map((seat) => (
                            <Chip
                              key={seat.id}
                              label={seat.name}
                              variant="outlined"
                            />
                          ))}
                        </Stack>

                        <Box sx={{ mt: 3 }}>
                          <Button
                            variant="outlined"
                            onClick={() => navigate("/movies")}
                          >
                            Book More Tickets
                          </Button>
                        </Box>
                      </CardContent>
                    </Box>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Layout>
  );
}

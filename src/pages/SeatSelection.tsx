import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Divider,
  LinearProgress,
  Stack,
  Grid,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Layout from "../components/Layout";

interface Seat {
  id: number;
  name: string;
  columnLetter: string;
  rowNumber: number;
  isBooked: boolean;
}

export interface ShowData {
  id: number;
  time: string;
  cost: string;
  venue: {
    id: number;
    name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
  };
  movie: {
    id: number;
    name: string;
    poster_url: string;
  };
  screen: {
    id: number;
    name: string;
    seats: Seat[];
  };
}

// Styled seat button
const SeatButton = styled(Button)(({ theme }) => ({
  minWidth: 36,
  height: 36,
  padding: 0,
  fontSize: "0.75rem",
  fontWeight: "bold",
  borderRadius: theme.shape.borderRadius,
  "&.available": {
    backgroundColor: "#4caf50",
    color: "white",
    "&:hover": {
      backgroundColor: "#388e3c",
    },
  },
  "&.selected": {
    backgroundColor: "#d32f2f",
    color: "white",
  },
  "&.unavailable": {
    backgroundColor: "#616161",
    color: "white",
    opacity: 0.6,
    cursor: "not-allowed",
  },
}));

// Legend item
const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Box sx={{ width: 24, height: 24, bgcolor: color, borderRadius: 1 }} />
    <Typography variant="body2">{label}</Typography>
  </Stack>
);

export default function SeatSelection() {
  const params = useParams();
  const showId = params.id;

  const [showData, setShowData] = useState<ShowData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/shows/?id=${showId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch shows");
        }

        const data = await res.json();
        setShowData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (showId) fetchShowData();
  }, [showId]);

  const handleSeatClick = (seatId: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
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

  const groupedSeats = showData.screen.seats.reduce((acc, seat) => {
    if (!acc[seat.columnLetter]) acc[seat.columnLetter] = [];
    acc[seat.columnLetter].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const totalCost = selectedSeats.length * parseFloat(showData.cost);

  return (
    <Layout>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={6}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {showData.movie.name} at {showData.venue.name}
          </Typography>
          <Typography variant="h6" color="grey.400">
            {showData.screen.name}
          </Typography>
          <Typography variant="body2" color="grey.500">
            {new Date(showData.time).toLocaleString()}
          </Typography>
        </Box>

        {/* Seat Layout */}
        <Paper elevation={3} sx={{ bgcolor: "#1e1e1e", p: 4, mb: 6 }}>
          {/* Screen Indicator */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h6" color="grey.300" fontWeight="bold">
              SCREEN
            </Typography>
            <Divider sx={{ bgcolor: "white", height: 2, mt: 1 }} />
          </Box>

          {/* Seats Grid */}
          <Box display="flex" justifyContent="center" overflow="auto">
            <Box>
              {Object.entries(groupedSeats).map(([column, seats]) => (
                <Stack
                  key={column}
                  direction="row"
                  spacing={1}
                  mb={2}
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      width: 32,
                      textAlign: "center",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "grey.500",
                    }}
                  >
                    {column}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {seats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      const isAvailable = !seat.isBooked;

                      return (
                        <SeatButton
                          key={seat.id}
                          onClick={() =>
                            isAvailable && handleSeatClick(seat.id)
                          }
                          disabled={!isAvailable}
                          className={
                            !isAvailable
                              ? "unavailable"
                              : isSelected
                              ? "selected"
                              : "available"
                          }
                          title={seat.name}
                        >
                          {seat.rowNumber}
                        </SeatButton>
                      );
                    })}
                  </Stack>
                </Stack>
              ))}
            </Box>
          </Box>

          {/* Legend */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={6}
            mt={6}
            sx={{ "& > *": { flex: 1, maxWidth: 140 } }}
          >
            <LegendItem color="#4caf50" label="Available" />
            <LegendItem color="#d32f2f" label="Selected" />
            <LegendItem color="#616161" label="Unavailable" />
          </Stack>
        </Paper>

        {/* Summary & Payment */}
        <Paper elevation={3} sx={{ bgcolor: "#1e1e1e", p: 4 }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography color="grey.400" gutterBottom>
                Selected Seats:{" "}
                <Typography component="span" fontWeight="bold" color="white">
                  {selectedSeats.length}
                </Typography>
              </Typography>
              <Typography color="grey.400">
                Price per Seat:{" "}
                <Typography component="span" fontWeight="bold" color="white">
                  ₹{showData.cost}
                </Typography>
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography color="grey.400" gutterBottom>
                Total Price
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="#4caf50">
                ₹{totalCost.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Link to={`/payment/${showData.id}`}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={selectedSeats.length === 0}
              onClick={() => {
                // localStorage.setItem(
                //   "seats",
                //   JSON.stringify({ seats: selectedSeats })
                // );
                localStorage.setItem("seats", JSON.stringify(selectedSeats));
              }}
              sx={{
                bgcolor: "#d32f2f",
                "&:hover": { bgcolor: "#b71c1c" },
                "&:disabled": { bgcolor: "#424242" },
                py: 1.5,
                fontWeight: "bold",
              }}
            >
              Proceed to Payment
            </Button>
          </Link>
        </Paper>
      </Container>
    </Layout>
  );
}

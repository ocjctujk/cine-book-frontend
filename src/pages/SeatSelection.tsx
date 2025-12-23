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
  Alert,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Layout from "../components/Layout";
import {
  EventSeat,
  LocalMovies,
  LocationOn,
  Schedule,
  Language as LanguageIcon,
  Theaters,
  Person,
} from "@mui/icons-material";

interface Seats {
  [key: string]: Seat[];
}

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
    description?: string;
    duration?: number;
    certificate?: {
      id: number;
      name: string;
      age: number;
    };
    genres?: Array<{ id: number; name: string }>;
    workers?: Array<{
      id: number;
      name: string;
      type: string;
      image_url?: string;
    }>;
  };
  screen: {
    id: number;
    name: string;
    venue: {
      id: number;
      name: string;
    };
    seats: Seats;
  };
  language?: {
    id: number;
    name: string;
  };
  format?: {
    id: number;
    name: string;
  };
}

// Styled seat button with enhanced animations
const SeatButton = styled(Button)(({ theme }) => ({
  minWidth: 40,
  height: 40,
  padding: 0,
  fontSize: "0.8rem",
  fontWeight: 700,
  borderRadius: 8,
  transition: "all 0.2s ease",
  "&.available": {
    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
    color: "white",
    boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
    "&:hover": {
      background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
      transform: "translateY(-2px)",
      boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`,
    },
  },
  "&.selected": {
    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
    color: "white",
    boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.5)}`,
    transform: "scale(1.1)",
    "&:hover": {
      background: `linear-gradient(135deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
    },
  },
  "&.unavailable": {
    backgroundColor: alpha(theme.palette.grey[600], 0.4),
    color: alpha(theme.palette.common.white, 0.5),
    cursor: "not-allowed",
    "&:hover": {
      backgroundColor: alpha(theme.palette.grey[600], 0.4),
    },
  },
}));

// Enhanced legend item
const LegendItem = ({ color, label }: { color: string; label: string }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          width: 32,
          height: 32,
          background: color,
          borderRadius: 2,
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
        }}
      />
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>
    </Stack>
  );
};

export default function SeatSelection() {
  const params = useParams();
  const showId = params.id;
  const theme = useTheme();

  const [showData, setShowData] = useState<ShowData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/shows/${showId}`);

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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ width: "100%", mt: 8 }}>
          <LinearProgress
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiLinearProgress-bar": {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              },
            }}
          />
          <Typography
            align="center"
            sx={{ mt: 4 }}
            variant="h6"
            color="text.secondary"
          >
            Loading show details...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Alert
            severity="error"
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            Error: {error}
          </Alert>
        </Container>
      </Layout>
    );
  }

  if (!showData) {
    return (
      <Layout>
        <Container sx={{ mt: 8 }}>
          <Typography align="center">No show data found</Typography>
        </Container>
      </Layout>
    );
  }

  const totalCost = selectedSeats.length * parseFloat(showData.cost);
  const availableSeats = Object.values(showData.screen.seats)
    .flat()
    .filter((seat) => !seat.isBooked).length;
  const bookedSeats = Object.values(showData.screen.seats)
    .flat()
    .filter((seat) => seat.isBooked).length;

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Movie Header Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.05
            )}, ${alpha(theme.palette.secondary.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack spacing={2}>
            {/* Title and Certificate */}
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={2}
            >
              <Box flex={1}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    mb: 1,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {showData.movie.name}
                </Typography>
                {showData.movie.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {showData.movie.description}
                  </Typography>
                )}
              </Box>
              {showData.movie.certificate && (
                <Chip
                  label={showData.movie.certificate.name}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                    color: "white",
                    borderRadius: 1.5,
                    px: 1.5,
                    height: 32,
                  }}
                />
              )}
            </Box>

            <Divider sx={{ opacity: 0.6 }} />

            {/* Movie Details Row */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" } }}
                />
              }
            >
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn
                  fontSize="small"
                  sx={{ color: theme.palette.primary.main }}
                />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {showData.venue.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {showData.venue.city}, {showData.venue.state}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <LocalMovies
                  fontSize="small"
                  sx={{ color: theme.palette.secondary.main }}
                />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {showData.screen.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Screen
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Schedule
                  fontSize="small"
                  sx={{ color: theme.palette.info.main }}
                />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(showData.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(showData.time).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {showData.movie.duration && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Schedule
                    fontSize="small"
                    sx={{ color: theme.palette.success.main }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {formatDuration(showData.movie.duration)}
                  </Typography>
                </Box>
              )}
            </Stack>

            {/* Additional Info */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {showData.language && (
                <Box display="flex" alignItems="center" gap={1}>
                  <LanguageIcon fontSize="small" color="action" />
                  <Chip
                    label={showData.language.name}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 500,
                      background: alpha(theme.palette.success.main, 0.15),
                      border: `1px solid ${alpha(
                        theme.palette.success.main,
                        0.3
                      )}`,
                    }}
                  />
                </Box>
              )}

              {showData.format && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Theaters fontSize="small" color="action" />
                  <Chip
                    label={showData.format.name}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}, ${alpha(theme.palette.primary.dark, 0.2)})`,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                    }}
                  />
                </Box>
              )}

              {showData.movie.genres && showData.movie.genres.length > 0 && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  {showData.movie.genres.slice(0, 3).map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 500,
                        background: alpha(theme.palette.secondary.main, 0.1),
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          0.3
                        )}`,
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>

            {/* Cast & Crew */}
            {showData.movie.workers && showData.movie.workers.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  mb={1}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <Person fontSize="small" />
                  Cast & Crew
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {showData.movie.workers.slice(0, 5).map((worker) => (
                    <Chip
                      key={worker.id}
                      label={worker.name}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 500,
                        background: alpha(theme.palette.grey[500], 0.1),
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Seat Layout */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 3,
            borderRadius: 3,
            background: alpha(theme.palette.background.default, 0.6),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          {/* Screen Indicator */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                display: "inline-block",
                px: 6,
                py: 1.5,
                borderRadius: 2,
                background: `linear-gradient(180deg, ${alpha(
                  theme.palette.grey[300],
                  0.3
                )}, ${alpha(theme.palette.grey[700], 0.1)})`,
                border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
                mb: 1,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="text.secondary">
                SCREEN
              </Typography>
            </Box>
            <Box
              sx={{
                height: 4,
                background: `linear-gradient(90deg, transparent, ${theme.palette.divider}, transparent)`,
                borderRadius: 2,
              }}
            />
          </Box>

          {/* Seats Grid */}
          <Box display="flex" justifyContent="center" overflow="auto" mb={4}>
            <Box>
              {(() => {
                const rows = Object.values(showData.screen.seats);
                const maxSeats = Math.max(...rows.map((row) => row.length));
                const seatWidth = 40;
                const gap = 8;
                const totalSeatsWidth =
                  maxSeats * seatWidth + (maxSeats - 1) * gap;

                return Object.entries(showData.screen.seats).map(
                  ([rowLabel, seats]) => (
                    <Stack
                      key={rowLabel}
                      direction="row"
                      spacing={1}
                      mb={1.5}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 2,
                          background: alpha(theme.palette.primary.main, 0.1),
                          border: `2px solid ${alpha(
                            theme.palette.primary.main,
                            0.2
                          )}`,
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {rowLabel}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: totalSeatsWidth,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
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
                      </Box>
                    </Stack>
                  )
                );
              })()}
            </Box>
          </Box>

          {/* Legend & Stats */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
            sx={{
              p: 3,
              borderRadius: 2,
              background: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack direction="row" spacing={4}>
              <LegendItem
                color={`linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`}
                label="Available"
              />
              <LegendItem
                color={`linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`}
                label="Selected"
              />
              <LegendItem
                color={alpha(theme.palette.grey[600], 0.4)}
                label="Unavailable"
              />
            </Stack>

            <Stack
              direction="row"
              spacing={3}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="success.main">
                  {availableSeats}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="error.main">
                  {bookedSeats}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Booked
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>

        {/* Summary & Payment */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={3}
            mb={3}
          >
            <Box>
              <Stack direction="row" spacing={3} alignItems="center" mb={1.5}>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: alpha(theme.palette.primary.main, 0.1),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Selected Seats
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {selectedSeats.length}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: alpha(theme.palette.info.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Price per Seat
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="info.main">
                    ₹{showData.cost}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              textAlign={{ xs: "left", sm: "right" }}
              sx={{
                px: 3,
                py: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.success.main,
                  0.1
                )}, ${alpha(theme.palette.success.dark, 0.05)})`,
                border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                mb={0.5}
              >
                Total Amount
              </Typography>
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ₹{totalCost.toFixed(2)}
              </Typography>
            </Box>
          </Stack>

          <Link
            to={`/payment/${showData.id}`}
            style={{ textDecoration: "none" }}
          >
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<EventSeat />}
              disabled={selectedSeats.length === 0}
              onClick={() => {
                localStorage.setItem("seats", JSON.stringify(selectedSeats));
              }}
              sx={{
                py: 2,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 20px ${alpha(
                    theme.palette.primary.main,
                    0.5
                  )}`,
                },
                "&:disabled": {
                  background: alpha(theme.palette.action.disabled, 0.12),
                  color: theme.palette.action.disabled,
                },
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

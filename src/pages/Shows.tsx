import Layout from "../components/Layout";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  CardActionArea,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.types";

interface Venue {
  id: number;
  name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
}

interface Show {
  id: number;
  time: string;
  cost: string;
  screen: string;
  venue: Venue;
  movie: Movie;
}

const formatDateHeader = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Shows = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      if (!movieId) return;

      try {
        setLoading(true);
        setError(false);

        const res = await fetch(
          `http://localhost:3000/shows/?movie_id=${movieId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch shows");
        }

        const data: Show[] = await res.json();
        setShows(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movieId]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  if (error || shows.length === 0) {
    return (
      <Layout>
        <Box sx={{ p: 4, maxWidth: 600, mx: "auto", textAlign: "center" }}>
          <Alert severity="error" sx={{ fontSize: "1rem" }}>
            {error
              ? "Failed to load shows. Please try again later."
              : "No shows available for this movie."}
          </Alert>
        </Box>
      </Layout>
    );
  }

  const movie = shows[0].movie;

  // Separate cast and crew
  const cast = movie.workers?.filter((w) => w.type === "cast") || [];
  const crew = movie.workers?.filter((w) => w.type === "crew") || [];

  // Group shows: first by date (YYYY-MM-DD), then by venue
  const groupedByDate = shows.reduce((acc, show) => {
    const dateKey = new Date(show.time).toISOString().split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(show);
    return acc;
  }, {} as Record<string, Show[]>);

  // Further group each date's shows by venue
  const groupedData = Object.entries(groupedByDate)
    .map(([dateKey, dateShows]) => {
      const venueGroups = dateShows.reduce((acc, show) => {
        const venueId = show.venue.id;
        if (!acc[venueId]) {
          acc[venueId] = {
            venue: show.venue,
            shows: [],
          };
        }
        acc[venueId].shows.push(show);
        return acc;
      }, {} as Record<number, { venue: Venue; shows: Show[] }>);

      return {
        dateKey,
        dateDisplay: formatDateHeader(dateShows[0].time),
        venues: Object.values(venueGroups),
      };
    })
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 4 },
            mb: 4,
          }}
        >
          {/* Movie Poster */}
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 0 350px" } }}>
            <Card
              elevation={8}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                position: "sticky",
                top: 20,
              }}
            >
              <CardMedia
                component="img"
                image={movie.poster_url}
                alt={movie.name}
                sx={{
                  height: { xs: 400, sm: 500, md: 520 },
                  objectFit: "cover",
                }}
              />
            </Card>
          </Box>

          {/* Movie Details */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="bold"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                mb: 2,
              }}
            >
              {movie.name}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
            >
              <Chip
                label={`${movie.duration} min`}
                size="medium"
                sx={{ fontWeight: 500 }}
              />
              {movie.certificate && (
                <Chip
                  label={`${movie.certificate.name} ${
                    movie.certificate.age > 13
                      ? `• ${movie.certificate.age}+`
                      : ""
                  }`}
                  color={movie.certificate.age > 13 ? "error" : "default"}
                  size="medium"
                  sx={{ fontWeight: 500 }}
                />
              )}
            </Stack>

            {movie.genres && movie.genres.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {movie.genres.map((genre, idx) => (
                  <Chip
                    key={idx}
                    label={genre.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}

            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              {movie.description}
            </Typography>

            {/* Cast and Crew Section */}
            {(cast.length > 0 || crew.length > 0) && (
              <>
                <Divider sx={{ my: 4 }} />

                {cast.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight="bold"
                      sx={{ mb: 3 }}
                    >
                      Cast
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, 1fr)",
                          sm: "repeat(3, 1fr)",
                          md: "repeat(4, 1fr)",
                        },
                        gap: 3,
                      }}
                    >
                      {cast.map((person) => (
                        <Box
                          key={person.id}
                          sx={{
                            textAlign: "center",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          <Avatar
                            src={person.image_url}
                            alt={person.name}
                            sx={{
                              width: { xs: 80, sm: 100 },
                              height: { xs: 80, sm: 100 },
                              mx: "auto",
                              mb: 1.5,
                              border: "3px solid",
                              borderColor: "primary.main",
                              boxShadow: 2,
                            }}
                          >
                            {person.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                          >
                            {person.name}
                          </Typography>
                          {person.introduction && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                              }}
                            >
                              {person.introduction}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {crew.length > 0 && (
                  <Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight="bold"
                      sx={{ mb: 3 }}
                    >
                      Crew
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, 1fr)",
                          sm: "repeat(3, 1fr)",
                          md: "repeat(4, 1fr)",
                        },
                        gap: 3,
                      }}
                    >
                      {crew.map((person) => (
                        <Box
                          key={person.id}
                          sx={{
                            textAlign: "center",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          <Avatar
                            src={person.image_url}
                            alt={person.name}
                            sx={{
                              width: { xs: 80, sm: 100 },
                              height: { xs: 80, sm: 100 },
                              mx: "auto",
                              mb: 1.5,
                              border: "3px solid",
                              borderColor: "secondary.main",
                              boxShadow: 2,
                            }}
                          >
                            {person.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                          >
                            {person.name}
                          </Typography>
                          {person.introduction && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                              }}
                            >
                              {person.introduction}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Shows Section */}
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Available Shows
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {groupedData.map(({ dateKey, dateDisplay, venues }) => (
            <Box key={dateKey}>
              {/* Date Header */}
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: 2,
                  position: "sticky",
                  top: 16,
                  zIndex: 100,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  {dateDisplay}
                </Typography>
              </Paper>

              {/* Venues */}
              {venues.map(({ venue, shows: venueShows }) => (
                <Box key={venue.id} sx={{ mb: 5 }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2.5,
                      mb: 3,
                      borderRadius: 2,
                      backgroundColor: "grey.50",
                      borderLeft: "4px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {venue.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {venue.address_line_1}
                      {venue.address_line_2 && `, ${venue.address_line_2}`}
                      {" • "}
                      {venue.city}, {venue.state}
                    </Typography>
                  </Paper>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                      },
                      gap: 2.5,
                    }}
                  >
                    {venueShows.map((show) => (
                      <Card
                        key={show.id}
                        elevation={2}
                        sx={{
                          height: "100%",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            elevation: 8,
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() => navigate(`/shows/seats/${show.id}`)}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "stretch",
                          }}
                        >
                          <CardContent
                            sx={{ flexGrow: 1, width: "100%", p: 3 }}
                          >
                            <Stack spacing={2}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                }}
                              >
                                <AccessTimeIcon
                                  sx={{
                                    color: "primary.main",
                                    fontSize: "1.75rem",
                                  }}
                                />
                                <Typography variant="h6" fontWeight="bold">
                                  {new Date(show.time).toLocaleTimeString(
                                    "en-US",
                                    {
                                      timeStyle: "short",
                                    }
                                  )}
                                </Typography>
                              </Box>

                              <Divider />

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  color="success.main"
                                  fontWeight="bold"
                                >
                                  ₹{show.cost}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default Shows;

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Fade,
  CardMedia,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  CalendarToday,
  Theaters,
  Language,
  CurrencyRupee,
  AccessTime,
} from "@mui/icons-material";

const VenueShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/shows/venue?venue_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch shows");
        const data = await res.json();
        setShows(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [id, token]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Layout>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Venue Shows
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        )}

        {error && (
          <Fade in>
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {!loading && !error && shows.length === 0 && (
          <Card
            sx={{
              mt: 4,
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Theaters sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No shows available at this venue
            </Typography>
          </Card>
        )}

        <Grid container spacing={3} mt={1}>
          {shows.map((show: any, index: number) => (
            <Grid key={show.id}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease-in-out",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Grid container>
                    {/* Movie Poster */}
                    <Grid>
                      <CardMedia
                        component="img"
                        image={
                          show.movie?.poster_url ||
                          "https://via.placeholder.com/300x450"
                        }
                        alt={show.movie?.name}
                        sx={{
                          height: { xs: 300, md: "100%" },
                          objectFit: "cover",
                        }}
                      />
                    </Grid>

                    {/* Movie Details */}
                    <Grid>
                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2.5}>
                          {/* Title and Certificate */}
                          <Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={2}
                              flexWrap="wrap"
                              mb={1}
                            >
                              <Typography
                                variant="h4"
                                sx={{
                                  fontWeight: 700,
                                  color: "primary.main",
                                }}
                              >
                                {show.movie?.name}
                              </Typography>
                              {show.movie?.certificate && (
                                <Chip
                                  label={show.movie.certificate.name}
                                  size="small"
                                  sx={{
                                    fontWeight: 600,
                                    bgcolor: "error.light",
                                    color: "error.contrastText",
                                  }}
                                />
                              )}
                            </Box>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {show.movie?.description}
                            </Typography>
                          </Box>

                          <Divider />

                          {/* Genres and Duration */}
                          <Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              mb={2}
                            >
                              {show.movie?.genres?.map((genre: any) => (
                                <Chip
                                  key={genre.id}
                                  label={genre.name}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))}
                            </Stack>
                            <Box display="flex" alignItems="center" gap={1}>
                              <AccessTime
                                sx={{ fontSize: 20, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {show.movie?.duration
                                  ? formatDuration(show.movie.duration)
                                  : "N/A"}
                              </Typography>
                            </Box>
                          </Box>

                          <Divider />

                          {/* Show Details */}
                          <Grid container spacing={2}>
                            <Grid>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 0.5,
                                  }}
                                >
                                  <CalendarToday sx={{ fontSize: 16 }} />
                                  Show Time
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {new Date(show.time).toLocaleString(
                                    undefined,
                                    {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    }
                                  )}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 0.5,
                                  }}
                                >
                                  <Theaters sx={{ fontSize: 16 }} />
                                  Screen & Format
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {show.screen?.name || "N/A"}
                                </Typography>
                                <Chip
                                  label={show.format?.name || "N/A"}
                                  size="small"
                                  color="primary"
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            </Grid>

                            <Grid>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 0.5,
                                  }}
                                >
                                  <Language sx={{ fontSize: 16 }} />
                                  Language
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {show.language?.name || "N/A"}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 0.5,
                                  }}
                                >
                                  <CurrencyRupee sx={{ fontSize: 16 }} />
                                  Ticket Price
                                </Typography>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: 700,
                                    color: "success.main",
                                  }}
                                >
                                  ₹{show.cost}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Stack>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default VenueShows;

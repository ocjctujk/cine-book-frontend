import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Paper,
  Divider,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import { useAuth } from "../../context/useAuth";
import {
  AccessTime,
  CalendarToday,
  Language,
  Theaters,
  Add,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const SuperAdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:3000/movies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [token]);

  const formatDuration = (minutes: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress size={48} thickness={4} />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box p={4}>
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.15)}`,
            }}
          >
            {error}
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={{ xs: 2, md: 4 }} sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Movies Library
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {movies.length} {movies.length === 1 ? "movie" : "movies"}{" "}
              available
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/superadmin/movies/add"
            variant="contained"
            startIcon={<Add />}
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
              },
            }}
          >
            Add New Movie
          </Button>
        </Box>

        {movies.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05
              )}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              No movies found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Start by adding your first movie to the library
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2.5}>
            {movies.map((movie: any) => (
              <Paper
                key={movie.id}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: "all 0.3s ease",
                  background: theme.palette.background.paper,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px ${alpha(
                      theme.palette.common.black,
                      0.12
                    )}`,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                  },
                }}
              >
                <Stack spacing={2.5}>
                  {/* Title + Certificate */}
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    gap={2}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{
                        flex: 1,
                        lineHeight: 1.3,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {movie.name}
                    </Typography>
                    {movie.certificate && (
                      <Chip
                        label={movie.certificate.name}
                        size="medium"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                          color: "white",
                          borderRadius: 1.5,
                          px: 1,
                        }}
                      />
                    )}
                  </Box>

                  <Divider sx={{ opacity: 0.6 }} />

                  {/* Basic Info Row */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 2, sm: 4 }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    flexWrap="wrap"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        background: alpha(theme.palette.primary.main, 0.08),
                      }}
                    >
                      <AccessTime
                        fontSize="small"
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {formatDuration(movie.duration)}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        background: alpha(theme.palette.info.main, 0.08),
                      }}
                    >
                      <CalendarToday
                        fontSize="small"
                        sx={{ color: theme.palette.info.main }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(movie.release_date)}
                      </Typography>
                    </Box>

                    {/* Genres */}
                    {movie.genres?.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.secondary"
                          sx={{ minWidth: "fit-content" }}
                        >
                          Genres:
                        </Typography>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap">
                          {movie.genres.slice(0, 5).map((g: any) => (
                            <Chip
                              key={g.id}
                              label={g.name}
                              size="small"
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 500,
                                background: alpha(
                                  theme.palette.secondary.main,
                                  0.1
                                ),
                                border: `1px solid ${alpha(
                                  theme.palette.secondary.main,
                                  0.3
                                )}`,
                                color: theme.palette.secondary.dark,
                                "&:hover": {
                                  background: alpha(
                                    theme.palette.secondary.main,
                                    0.2
                                  ),
                                },
                              }}
                            />
                          ))}
                          {movie.genres.length > 5 && (
                            <Chip
                              label={`+${movie.genres.length - 5}`}
                              size="small"
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 600,
                                background: alpha(
                                  theme.palette.grey[500],
                                  0.15
                                ),
                              }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    )}
                  </Stack>

                  {/* Languages & Formats */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 2, sm: 4 }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    flexWrap="wrap"
                  >
                    {movie.languages?.length > 0 && (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        flexWrap="wrap"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.75}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                            background: alpha(theme.palette.success.main, 0.1),
                          }}
                        >
                          <Language
                            fontSize="small"
                            sx={{ color: theme.palette.success.main }}
                          />
                          <Typography variant="caption" fontWeight={600}>
                            Languages
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap">
                          {movie.languages.map((l: any) => (
                            <Chip
                              key={l.id}
                              label={l.name}
                              size="small"
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 500,
                                background: alpha(
                                  theme.palette.success.main,
                                  0.08
                                ),
                                border: `1px solid ${alpha(
                                  theme.palette.success.main,
                                  0.25
                                )}`,
                                color: theme.palette.success.dark,
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {movie.formats?.length > 0 && (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        flexWrap="wrap"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.75}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                            background: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <Theaters
                            fontSize="small"
                            sx={{ color: theme.palette.primary.main }}
                          />
                          <Typography variant="caption" fontWeight={600}>
                            Formats
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap">
                          {movie.formats.map((f: any) => (
                            <Chip
                              key={f.id}
                              label={f.name}
                              size="small"
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 600,
                                background: `linear-gradient(135deg, ${alpha(
                                  theme.palette.primary.main,
                                  0.15
                                )}, ${alpha(
                                  theme.palette.primary.dark,
                                  0.15
                                )})`,
                                border: `1px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.3
                                )}`,
                                color: theme.palette.primary.dark,
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>

                  {/* Description */}
                  {movie.description && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: alpha(theme.palette.grey[500], 0.05),
                        borderLeft: `3px solid ${alpha(
                          theme.palette.primary.main,
                          0.4
                        )}`,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                          fontStyle:
                            movie.description.length > 200
                              ? "normal"
                              : "normal",
                        }}
                      >
                        {movie.description.length > 200
                          ? `${movie.description.substring(0, 200)}...`
                          : movie.description}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Layout>
  );
};

export default SuperAdminMovies;

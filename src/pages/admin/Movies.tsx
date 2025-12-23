import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Fade,
  CardMedia,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { useAuth } from "../../context/useAuth";
import {
  AccessTime,
  CalendarToday,
  Language,
  Theaters,
  Star,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:3000/movie", {
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
          All Movies
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

        {!loading && !error && movies.length === 0 && (
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
              No movies available
            </Typography>
          </Card>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
          mt={1}
        >
          {movies.map((movie: any, index: number) => (
            <Box key={movie.id}>
              <Fade in timeout={300 + index * 100}>
                <Link style={{ textDecoration: "none" }} to={`${movie.id}`}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {/* Movie Poster */}
                    <CardMedia
                      component="img"
                      image={
                        movie.poster_url ||
                        "https://via.placeholder.com/300x450"
                      }
                      alt={movie.name}
                      sx={{
                        height: 400,
                        objectFit: "cover",
                      }}
                    />

                    <CardContent
                      sx={{
                        p: 2.5,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Stack spacing={2}>
                        {/* Title and Certificate */}
                        <Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            gap={1}
                            mb={1}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "primary.main",
                                lineHeight: 1.2,
                              }}
                            >
                              {movie.name}
                            </Typography>
                            {movie.certificate && (
                              <Chip
                                label={movie.certificate.name}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  bgcolor: "error.light",
                                  color: "error.contrastText",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              mb: 1.5,
                            }}
                          >
                            {movie.description}
                          </Typography>
                        </Box>

                        {/* Genres */}
                        {movie.genres && movie.genres.length > 0 && (
                          <Stack
                            direction="row"
                            spacing={0.5}
                            flexWrap="wrap"
                            sx={{ gap: 0.5 }}
                          >
                            {movie.genres.slice(0, 3).map((genre: any) => (
                              <Chip
                                key={genre.id}
                                label={genre.name}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            ))}
                          </Stack>
                        )}

                        {/* Duration and Release Date */}
                        <Stack spacing={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {movie.duration
                                ? formatDuration(movie.duration)
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(movie.release_date).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Languages */}
                        {movie.languages && movie.languages.length > 0 && (
                          <Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={0.5}
                            >
                              <Language
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={600}
                              >
                                Languages
                              </Typography>
                            </Box>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              flexWrap="wrap"
                              sx={{ gap: 0.5 }}
                            >
                              {movie.languages.slice(0, 3).map((lang: any) => (
                                <Chip
                                  key={lang.id}
                                  label={lang.name}
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                  sx={{ fontSize: "0.65rem" }}
                                />
                              ))}
                              {movie.languages.length > 3 && (
                                <Chip
                                  label={`+${movie.languages.length - 3}`}
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                  sx={{ fontSize: "0.65rem" }}
                                />
                              )}
                            </Stack>
                          </Box>
                        )}

                        {/* Formats */}
                        {movie.formats && movie.formats.length > 0 && (
                          <Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={0.5}
                            >
                              <Theaters
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={600}
                              >
                                Formats
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                              {movie.formats.map((format: any) => (
                                <Chip
                                  key={format.id}
                                  label={format.name}
                                  size="small"
                                  color="primary"
                                  sx={{ fontSize: "0.7rem" }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {/* Cast */}
                        {movie.workers &&
                          movie.workers.filter((w: any) => w.type === "cast")
                            .length > 0 && (
                            <Box sx={{ mt: "auto", pt: 1 }}>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={1}
                              >
                                <Star
                                  sx={{ fontSize: 16, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  fontWeight={600}
                                >
                                  Cast
                                </Typography>
                              </Box>
                              <AvatarGroup
                                max={4}
                                sx={{
                                  "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    fontSize: "0.75rem",
                                    border: "2px solid white",
                                  },
                                }}
                              >
                                {movie.workers
                                  .filter(
                                    (worker: any) => worker.type === "cast"
                                  )
                                  .map((actor: any) => (
                                    <Avatar
                                      key={actor.id}
                                      src={actor.image_url}
                                      alt={actor.name}
                                      title={actor.name}
                                    />
                                  ))}
                              </AvatarGroup>
                            </Box>
                          )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Link>
              </Fade>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default Movies;

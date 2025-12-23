import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import apiService from "../api/apiService";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import type { Movie } from "../types/movie.types";

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.get<Movie[]>("/movies");
        setMovies(response);
      } catch (err) {
        setError("Failed to load movies. Please try again later.");
        console.error("Error fetching movies:", err);

        // Optional: Keep mock data for development/demo only
        // setMovies([...mockData]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </Layout>
    );
  }

  if (error && movies.length === 0) {
    return (
      <Layout>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check your connection or try refreshing the page.
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (movies.length === 0) {
    return (
      <Layout>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" gutterBottom>
            No movies available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for new releases!
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            mb: 5,
            fontWeight: 700,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Now Showing
        </Typography>

        {error && (
          <Box sx={{ mb: 3 }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        <Grid container spacing={4}>
          {movies.map((movie) => (
            <Grid key={movie.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  width: "300px",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
                elevation={3}
              >
                <CardMedia
                  component="img"
                  image={
                    movie.poster_url ||
                    `https://dummyimage.com/300x450/333/ccc&text=No+Poster`
                  }
                  alt={`${movie.name} poster`}
                  sx={{
                    height: 300,
                    objectFit: "cover",
                    backgroundColor: "#f5f5f5",
                  }}
                />

                <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {movie.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {movie.description}
                  </Typography>

                  {/* 🎬 GENRES SECTION */}
                  {movie.genres && movie.genres.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      {movie.genres.map((genre) => (
                        <Chip
                          key={genre.id}
                          label={genre.name}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}

                  <Box
                    sx={{
                      mt: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {movie.release_date && (
                      <Typography variant="caption" color="text.secondary">
                        Release:{" "}
                        {new Date(movie.release_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    )}

                    {movie.duration && (
                      <Chip
                        label={`${movie.duration} min`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ alignSelf: "flex-start" }}
                      />
                    )}
                    {movie.certificate && movie.certificate.age > 13 && (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{ mt: 0.5 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {movie.certificate.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="error.main"
                          sx={{ fontWeight: 500 }}
                        >
                          • Only {movie.certificate.age}+
                        </Typography>
                      </Stack>
                    )}

                    <Link to={`/shows/${movie.id}`}>
                      <Button variant="contained" color="error" size="small">
                        Book Now
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}

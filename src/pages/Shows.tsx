import Layout from "../components/Layout";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  CardActionArea,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  name: string;
  description: string;
  release_date: string;
  poster_url: string;
  duration: number;
}

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
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || shows.length === 0) {
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="error">
            {error
              ? "Failed to load shows. Please try again later."
              : "No shows available for this movie."}
          </Alert>
        </Box>
      </Layout>
    );
  }

  const movie = shows[0].movie;

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
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey)); // Sort dates ascending

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Card elevation={6}>
              <CardMedia
                component="img"
                image={movie.poster_url}
                alt={movie.name}
                sx={{ height: 450, objectFit: "cover" }}
              />
            </Card>
          </Grid>

          {/* Movie Details & Grouped Shows */}
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {movie.name}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              {movie.description}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Duration: {movie.duration} minutes
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              Available Shows
            </Typography>

            {/* Grouped by Date */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {groupedData.map(({ dateKey, dateDisplay, venues }) => (
                <Box key={dateKey}>
                  {/* Date Bar */}
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      borderRadius: 2,
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {dateDisplay}
                    </Typography>
                  </Paper>

                  {/* Venues for this date */}
                  {venues.map(({ venue, shows: venueShows }) => (
                    <Box key={venue.id} sx={{ mb: 4 }}>
                      <Box sx={{ mb: 2, ml: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {venue.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {venue.address_line_1}
                          {venue.address_line_2 && `, ${venue.address_line_2}`}
                          <br />
                          {venue.city}, {venue.state}
                        </Typography>
                      </Box>

                      <Grid container spacing={3}>
                        {venueShows.map((show) => (
                          <Grid item xs={12} sm={6} md={4} key={show.id}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                              <CardActionArea
                                onClick={() =>
                                  navigate(`/shows/seats/${show.id}`)
                                } // Adjust the route as needed
                                sx={{
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <CardContent
                                  sx={{ flexGrow: 1, width: "100%" }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mb: 1,
                                    }}
                                  >
                                    <AccessTimeIcon
                                      sx={{ mr: 1, color: "primary.main" }}
                                    />
                                    <Typography variant="subtitle1">
                                      {new Date(show.time).toLocaleTimeString(
                                        "en-US",
                                        {
                                          timeStyle: "short",
                                        }
                                      )}
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <AttachMoneyIcon
                                      sx={{ mr: 1, color: "primary.main" }}
                                    />
                                    <Typography
                                      variant="h6"
                                      color="success.main"
                                    >
                                      ₹{show.cost}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Shows;

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
  Fade,
  Stack,
} from "@mui/material";
import { useAuth } from "../../context/useAuth";
import { Link } from "react-router-dom";
import { LocationOn, Business, ArrowForward } from "@mui/icons-material";

const Venues = () => {
  const { user, token } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/venue?user_id=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch venues");
        const data = await res.json();
        setVenues(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [user?.id, token]);

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
          My Venues
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

        {!loading && !error && venues.length === 0 && (
          <Card
            sx={{
              mt: 4,
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Business sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No venues found
            </Typography>
          </Card>
        )}

        <Grid container spacing={3} mt={1}>
          {venues.map((venue: any, index: number) => (
            <Grid key={venue.id}>
              <Fade in timeout={300 + index * 100}>
                <Link to={`/venues/movies`} style={{ textDecoration: "none" }}>
                  <Card
                    sx={{
                      minWidth: "400px",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(90deg, #2196F3, #21CBF3)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Stack spacing={2}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Business
                              sx={{
                                fontSize: 24,
                                color: "primary.main",
                              }}
                            />
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                              }}
                            >
                              {venue.name}
                            </Typography>
                          </Box>
                          <ArrowForward
                            sx={{
                              fontSize: 20,
                              color: "action.active",
                              transition: "transform 0.3s ease",
                              ".MuiCard-root:hover &": {
                                transform: "translateX(4px)",
                              },
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <LocationOn
                            sx={{
                              fontSize: 20,
                              color: "text.secondary",
                              mt: 0.3,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {venue.address_line_1}
                            {venue.address_line_2 && (
                              <>
                                <br />
                                {venue.address_line_2}
                              </>
                            )}
                            <br />
                            <Box
                              component="span"
                              sx={{ fontWeight: 500, color: "text.primary" }}
                            >
                              {venue.city}, {venue.state}
                            </Box>
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Link>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Venues;

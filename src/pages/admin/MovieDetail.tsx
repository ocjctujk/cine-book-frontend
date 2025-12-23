import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Fade,
  CardMedia,
  Divider,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  AccessTime,
  CalendarToday,
  Language,
  Theaters,
  Star,
  Add,
  MovieCreation,
} from "@mui/icons-material";
import { useAuth } from "../../context/useAuth";
import Layout from "../../components/Layout";

const MovieDetail = () => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showFormData, setShowFormData] = useState({
    time: "",
    cost: "",
    venue_id: "",
    screen_id: "",
    language_id: "",
    format_id: "",
  });
  const [venues, setVenues] = useState<any[]>([]);
  const [availableScreens, setAvailableScreens] = useState<any[]>([]);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:3000/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, token]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowFormData({
      time: "",
      cost: "",
      venue_id: "",
      screen_id: "",
      language_id: "",
      format_id: "",
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "venue_id") {
      const selected = venues.find(
        (v) => String(v.id) === String(value) || v.id === Number(value)
      );
      setAvailableScreens(selected?.screens || []);
      setShowFormData((prev) => ({
        ...prev,
        venue_id: String(value),
        screen_id: "",
      }));
      return;
    }

    setShowFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:3000/venue?user_id=41", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch venues");
        const data = await res.json();
        setVenues(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVenues();
  }, [token]);

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/shows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...showFormData,
          formatId: showFormData.format_id,
          languageId: showFormData.language_id,
          movieId: Number(id),
          screenId: Number(showFormData.screen_id),
          venueId: Number(showFormData.venue_id),
          cost: Number(showFormData.cost),
        }),
      });

      if (!res.ok) throw new Error("Failed to create show");

      handleCloseDialog();
      // Optionally show success message
      alert("Show created successfully!");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 64px)"
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Alert severity="error">{error || "Movie not found"}</Alert>
        </Box>
      </Layout>
    );
  }

  const castMembers =
    movie.workers?.filter((w: any) => w.type === "cast") || [];
  const crewMembers =
    movie.workers?.filter((w: any) => w.type === "crew") || [];

  return (
    <Layout>
      <Box
        sx={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Fade in>
          <Box>
            {/* Main Content */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Grid container spacing={4}>
                {/* Left Column - Poster */}
                <Grid>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        movie.poster_url ||
                        "https://via.placeholder.com/300x450"
                      }
                      alt={movie.name}
                      sx={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </Card>

                  {/* Add Show Button */}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<Add />}
                    onClick={handleOpenDialog}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      boxShadow: "0 4px 20px rgba(33,150,243,0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
                        boxShadow: "0 6px 25px rgba(33,150,243,0.4)",
                      },
                    }}
                  >
                    Add Show
                  </Button>
                </Grid>

                {/* Right Column - Details */}
                <Grid>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      p: 3,
                      minWidth: "700px",
                    }}
                  >
                    <Stack spacing={3}>
                      {/* Certificate and Basic Info */}
                      <Box>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          {movie.certificate && (
                            <Chip
                              label={movie.certificate.name}
                              sx={{
                                fontWeight: 600,
                                bgcolor: "error.light",
                                color: "error.contrastText",
                              }}
                            />
                          )}
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime
                              sx={{ fontSize: 20, color: "text.secondary" }}
                            />
                            <Typography variant="body1" color="text.secondary">
                              {formatDuration(movie.duration)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday
                              sx={{ fontSize: 20, color: "text.secondary" }}
                            />
                            <Typography variant="body1" color="text.secondary">
                              {new Date(movie.release_date).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          paragraph
                        >
                          {movie.description}
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Genres */}
                      {movie.genres && movie.genres.length > 0 && (
                        <Box>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontWeight={600}
                          >
                            Genres
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            sx={{ gap: 1 }}
                          >
                            {movie.genres.map((genre: any) => (
                              <Chip
                                key={genre.id}
                                label={genre.name}
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Divider />

                      {/* Languages */}
                      {movie.languages && movie.languages.length > 0 && (
                        <Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1.5}
                          >
                            <Language
                              sx={{ fontSize: 24, color: "primary.main" }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                              Available Languages
                            </Typography>
                          </Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            sx={{ gap: 1 }}
                          >
                            {movie.languages.map((lang: any) => (
                              <Chip
                                key={lang.id}
                                label={lang.name}
                                color="secondary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Divider />

                      {/* Formats */}
                      {movie.formats && movie.formats.length > 0 && (
                        <Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1.5}
                          >
                            <Theaters
                              sx={{ fontSize: 24, color: "primary.main" }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                              Available Formats
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            {movie.formats.map((format: any) => (
                              <Chip
                                key={format.id}
                                label={format.name}
                                color="primary"
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Divider />

                      {/* Cast */}
                      {castMembers.length > 0 && (
                        <Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={2}
                          >
                            <Star
                              sx={{ fontSize: 24, color: "primary.main" }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                              Cast
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            {castMembers.map((actor: any) => (
                              <Grid key={actor.id}>
                                <Box textAlign="center">
                                  <Avatar
                                    src={actor.image_url}
                                    alt={actor.name}
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      mx: "auto",
                                      mb: 1,
                                      border: "3px solid",
                                      borderColor: "primary.light",
                                    }}
                                  />
                                  <Typography variant="body2" fontWeight={600}>
                                    {actor.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Actor
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* Crew */}
                      {crewMembers.length > 0 && (
                        <>
                          <Divider />
                          <Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={2}
                            >
                              <MovieCreation
                                sx={{ fontSize: 24, color: "primary.main" }}
                              />
                              <Typography variant="h6" fontWeight={600}>
                                Crew
                              </Typography>
                            </Box>
                            <Grid container spacing={2}>
                              {crewMembers.map((crew: any) => (
                                <Grid key={crew.id}>
                                  <Box textAlign="center">
                                    <Avatar
                                      src={crew.image_url}
                                      alt={crew.name}
                                      sx={{
                                        width: 80,
                                        height: 80,
                                        mx: "auto",
                                        mb: 1,
                                        border: "3px solid",
                                        borderColor: "secondary.light",
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                    >
                                      {crew.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Crew
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>

        {/* Add Show Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Show</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Show Time"
                name="time"
                type="datetime-local"
                value={showFormData.time}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Ticket Cost"
                name="cost"
                type="number"
                value={showFormData.cost}
                onChange={handleInputChange}
                fullWidth
                placeholder="Enter ticket price"
              />
              <FormControl fullWidth>
                <InputLabel>Venue</InputLabel>
                <Select
                  name="venue_id"
                  value={showFormData.venue_id}
                  onChange={handleInputChange}
                  label="Venue"
                >
                  {venues.map((v: any) => (
                    <MenuItem key={v.id} value={String(v.id)}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Screen</InputLabel>
                <Select
                  name="screen_id"
                  value={showFormData.screen_id}
                  onChange={handleInputChange}
                  label="Screen"
                  disabled={availableScreens.length === 0}
                >
                  {availableScreens.map((s: any) => (
                    <MenuItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  name="language_id"
                  value={showFormData.language_id}
                  onChange={handleInputChange}
                  label="Language"
                >
                  {movie.languages?.map((lang: any) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  name="format_id"
                  value={showFormData.format_id}
                  onChange={handleInputChange}
                  label="Format"
                >
                  {movie.formats?.map((format: any) => (
                    <MenuItem key={format.id} value={format.id}>
                      {format.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Create Show
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default MovieDetail;

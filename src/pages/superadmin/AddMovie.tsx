import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Checkbox,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { useAuth } from "../../context/useAuth";
import {
  Movie as MovieIcon,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";

interface Option {
  id: number;
  name: string;
}

const AddMoviePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    release_date: "",
    poster_url: "",
    duration: "",
    certificateId: "",
    genreIds: [] as number[],
    workerIds: [] as number[],
    languageIds: [] as number[],
    formatIds: [] as number[],
  });

  // Options fetched from backend
  const [certificates, setCertificates] = useState<Option[]>([]);
  const [genres, setGenres] = useState<Option[]>([]);
  const [languages, setLanguages] = useState<Option[]>([]);
  const [formats, setFormats] = useState<Option[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Fetch dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const endpoints = ["certificates", "genres", "languages", "formats"];

        const promises = endpoints.map((endpoint) =>
          fetch(`http://localhost:3000/${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error(`Failed to load ${endpoint}`);
            return res.json();
          })
        );

        const [certs, gens, langs, fmts] = await Promise.all(promises);
        console.log(certs);
        setCertificates(certs);
        setGenres(gens);
        setLanguages(langs);
        setFormats(fmts);
      } catch (err: any) {
        setError("Failed to load form options: " + err.message);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      release_date: formData.release_date,
      poster_url: formData.poster_url.trim() || null,
      duration: formData.duration ? Number(formData.duration) : null,
      certificateId: formData.certificateId
        ? Number(formData.certificateId)
        : null,
      genreIds: formData.genreIds,
      workerIds: formData.workerIds,
      languageIds: formData.languageIds,
      formatIds: formData.formatIds,
    };

    try {
      const res = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to add movie");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/superadmin/movies");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (optionsLoading) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
        >
          <CircularProgress size={48} thickness={4} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={{ xs: 2, md: 4 }} sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            textTransform: "none",
            fontWeight: 600,
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          Back to Movies
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: theme.palette.background.paper,
            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                mx: "auto",
                mb: 2,
                boxShadow: `0 8px 16px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
              }}
            >
              <MovieIcon sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 1,
              }}
            >
              Add New Movie
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details to add a movie to your library
            </Typography>
          </Box>

          {success && (
            <Alert
              icon={<CheckCircle />}
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                background: alpha(theme.palette.success.main, 0.1),
              }}
            >
              Movie added successfully! Redirecting...
            </Alert>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                background: alpha(theme.palette.error.main, 0.1),
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Basic Information Section */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.secondary"
                  mb={2}
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontSize: "0.75rem",
                  }}
                >
                  Basic Information
                </Typography>
                <Stack spacing={2.5}>
                  <TextField
                    label="Movie Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Enter a brief description of the movie..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Release Date"
                      type="date"
                      value={formData.release_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          release_date: e.target.value,
                        })
                      }
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      label="Duration (minutes)"
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      required
                      fullWidth
                      inputProps={{ min: 1 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Stack>

                  <TextField
                    label="Poster URL (optional)"
                    value={formData.poster_url}
                    onChange={(e) =>
                      setFormData({ ...formData, poster_url: e.target.value })
                    }
                    fullWidth
                    placeholder="https://example.com/poster.jpg"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Classification Section */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.secondary"
                  mb={2}
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontSize: "0.75rem",
                  }}
                >
                  Classification
                </Typography>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel>Certificate</InputLabel>
                  <Select
                    value={formData.certificateId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificateId: e.target.value as string,
                      })
                    }
                    label="Certificate"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {certificates.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Categories Section */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.secondary"
                  mb={2}
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontSize: "0.75rem",
                  }}
                >
                  Categories & Attributes
                </Typography>
                <Stack spacing={2.5}>
                  <FormControl
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <InputLabel>Genres</InputLabel>
                    <Select
                      multiple
                      value={formData.genreIds}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          genreIds: e.target.value as number[],
                        })
                      }
                      input={<OutlinedInput label="Genres" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}
                        >
                          {(selected as number[]).map((id) => {
                            const genre = genres.find((g) => g.id === id);
                            return (
                              <Chip
                                key={id}
                                label={genre?.name}
                                size="small"
                                sx={{
                                  borderRadius: 1.5,
                                  fontWeight: 500,
                                  background: alpha(
                                    theme.palette.secondary.main,
                                    0.15
                                  ),
                                  border: `1px solid ${alpha(
                                    theme.palette.secondary.main,
                                    0.3
                                  )}`,
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {genres.map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                          <Checkbox
                            checked={formData.genreIds.includes(g.id)}
                          />
                          <ListItemText primary={g.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <InputLabel>Languages</InputLabel>
                    <Select
                      multiple
                      value={formData.languageIds}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          languageIds: e.target.value as number[],
                        })
                      }
                      input={<OutlinedInput label="Languages" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}
                        >
                          {(selected as number[]).map((id) => {
                            const lang = languages.find((l) => l.id === id);
                            return (
                              <Chip
                                key={id}
                                label={lang?.name}
                                size="small"
                                sx={{
                                  borderRadius: 1.5,
                                  fontWeight: 500,
                                  background: alpha(
                                    theme.palette.success.main,
                                    0.15
                                  ),
                                  border: `1px solid ${alpha(
                                    theme.palette.success.main,
                                    0.3
                                  )}`,
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {languages.map((l) => (
                        <MenuItem key={l.id} value={l.id}>
                          <Checkbox
                            checked={formData.languageIds.includes(l.id)}
                          />
                          <ListItemText primary={l.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <InputLabel>Formats</InputLabel>
                    <Select
                      multiple
                      value={formData.formatIds}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          formatIds: e.target.value as number[],
                        })
                      }
                      input={<OutlinedInput label="Formats" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}
                        >
                          {(selected as number[]).map((id) => {
                            const fmt = formats.find((f) => f.id === id);
                            return (
                              <Chip
                                key={id}
                                label={fmt?.name}
                                size="small"
                                sx={{
                                  borderRadius: 1.5,
                                  fontWeight: 600,
                                  background: `linear-gradient(135deg, ${alpha(
                                    theme.palette.primary.main,
                                    0.2
                                  )}, ${alpha(
                                    theme.palette.primary.dark,
                                    0.2
                                  )})`,
                                  border: `1px solid ${alpha(
                                    theme.palette.primary.main,
                                    0.3
                                  )}`,
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {formats.map((f) => (
                        <MenuItem key={f.id} value={f.id}>
                          <Checkbox
                            checked={formData.formatIds.includes(f.id)}
                          />
                          <ListItemText primary={f.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                mt={4}
                pt={3}
                sx={{
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    borderColor: alpha(theme.palette.divider, 0.3),
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                      background: alpha(theme.palette.error.main, 0.05),
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.duration ||
                    !formData.release_date
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 16px ${alpha(
                        theme.palette.primary.main,
                        0.4
                      )}`,
                    },
                    "&:disabled": {
                      background: alpha(theme.palette.action.disabled, 0.12),
                      color: theme.palette.action.disabled,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Add Movie"
                  )}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AddMoviePage;

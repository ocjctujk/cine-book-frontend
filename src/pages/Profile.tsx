import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/useAuth";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
  Chip,
  TextField,
  Grid,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dob: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
  password?: string;
}

const Profile = () => {
  const { user, logout } = useAuth() as {
    user: User | null;
    logout: () => void;
  };
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setFormData(user);
    }
  }, [user, navigate]);

  if (!user || !formData) {
    return null;
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
    0
  )}`.toUpperCase();

  const hasAddress =
    user.address_line_1 ||
    user.address_line_2 ||
    user.city ||
    user.state ||
    user.pincode;

  const formattedAddress = [
    user.address_line_1,
    user.address_line_2,
    user.city
      ? `${user.city}, ${user.state} ${user.pincode}`.trim()
      : `${user.state} ${user.pincode}`.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    try {
      setSaveSuccess(true);
      setIsEditing(false);
    } catch (error) {
      setSaveError("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              py: 5,
              px: 4,
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 100, md: 140 },
                  height: { xs: 100, md: 140 },
                  fontSize: { xs: 40, md: 56 },
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  color: "#667eea",
                  border: "5px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                  {fullName}
                </Typography>
                <Chip
                  icon={<PersonIcon />}
                  label={`ID: #${user.id}`}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 600,
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                position: "absolute",
                top: 24,
                right: 24,
                display: "flex",
                gap: 1,
              }}
            >
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{
                      bgcolor: "white",
                      color: "#667eea",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                      boxShadow: 3,
                    }}
                  >
                    Save Changes
                  </Button>
                  <IconButton
                    onClick={handleCancel}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    bgcolor: "white",
                    color: "#667eea",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                    boxShadow: 3,
                  }}
                >
                  Edit Profile
                </Button>
              )}
              <Button
                onClick={logout}
                sx={{
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Contact Information */}
              <Grid>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <EmailIcon /> Contact Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Box>

                {isEditing ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <EmailIcon color="primary" />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            Email Address
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <PhoneIcon color="primary" />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            Phone Number
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {user.phone || (
                              <Chip
                                label="Not provided"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}
              </Grid>

              {/* Personal Details */}
              <Grid>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PersonIcon /> Personal Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Box>

                {isEditing ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Grid container spacing={2}>
                      <Grid>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CalendarIcon color="primary" />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight="600"
                        >
                          Date of Birth
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {user.dob || (
                            <Chip
                              label="Not provided"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Grid>

              {/* Address Information */}
              <Grid>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LocationIcon /> Address Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Box>

                {isEditing ? (
                  <Grid container spacing={2}>
                    <Grid>
                      <TextField
                        fullWidth
                        label="Address Line 1"
                        name="address_line_1"
                        value={formData.address_line_1}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid>
                      <TextField
                        fullWidth
                        label="Address Line 2"
                        name="address_line_2"
                        value={formData.address_line_2}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid>
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Box sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
                    {hasAddress ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <LocationIcon color="primary" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            Full Address
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="500"
                            sx={{ mt: 0.5 }}
                          >
                            {formattedAddress}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <LocationIcon
                          color="disabled"
                          sx={{ fontSize: 48, mb: 1 }}
                        />
                        <Typography color="text.secondary">
                          No address information provided
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={4000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSaveSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!saveError}
        autoHideDuration={4000}
        onClose={() => setSaveError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSaveError("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {saveError}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Profile;

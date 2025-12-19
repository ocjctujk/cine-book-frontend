import { Typography, Box, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Bookings() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        My Bookings
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No bookings yet
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{ mb: 3 }}
        >
          Start by browsing our movies and book your tickets for your favorite
          shows.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/movies")}
        >
          Browse Movies
        </Button>
      </Box>

      <Paper sx={{ p: 4, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>
          How to Book Tickets
        </Typography>
        <Box component="ol" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" paragraph>
            Browse through available movies
          </Typography>
          <Typography component="li" variant="body2" paragraph>
            Select your preferred show time and cinema
          </Typography>
          <Typography component="li" variant="body2" paragraph>
            Choose your seats and complete payment
          </Typography>
          <Typography component="li" variant="body2">
            Receive your booking confirmation
          </Typography>
        </Box>
      </Paper>
    </Layout>
  );
}

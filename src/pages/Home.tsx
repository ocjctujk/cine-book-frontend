import { Typography, Box, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Welcome to Cine-Book
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Your ultimate movie booking platform
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Browse Movies
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Explore our extensive collection of movies and find your next
              favorite film.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/movies")}>
              View Movies
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Book Tickets
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Reserve your seats and book tickets for upcoming movie showings.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/bookings")}>
              Book Now
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Bookings from "./pages/Bookings";
import Shows from "./pages/Shows";
import SeatSelection from "./pages/SeatSelection";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows/:id" element={<Shows />} />
          <Route path="/shows/seats/:id" element={<SeatSelection />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

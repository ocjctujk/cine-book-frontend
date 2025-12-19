import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Bookings', path: '/bookings' },
  ];

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <MovieIcon sx={{ display: 'flex', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 'auto',
              fontWeight: 'bold',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            Cine-Book
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: 'inherit',
                  textDecoration: location.pathname === item.path ? 'underline' : 'none',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

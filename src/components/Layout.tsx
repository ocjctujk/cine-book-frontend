import { Box, Container } from '@mui/material';
import Navigation from './Navigation';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Navigation />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 4,
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <p>&copy; 2025 Cine-Book. All rights reserved.</p>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;

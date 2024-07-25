import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  return (
    <AppBar position="static" style={{ marginBottom: '1rem' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" style={{ display: 'block' }}>
          Travel Advisor
        </Typography>
        <Box display="flex">
          <Typography variant="h6" style={{ display: 'block' }}>
            Explore new places
          </Typography>
          <div style={{ position: 'relative', marginLeft: '1rem' }}>
            <div style={{ position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SearchIcon />
            </div>
            <InputBase 
              placeholder="Search…" 
              style={{
                color: 'inherit',
                paddingLeft: '2rem',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                }
              }} 
            />
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

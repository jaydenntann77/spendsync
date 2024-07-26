import { createTheme, responsiveFontSizes } from "@mui/material";
import { teal, amber, lime, grey, blueGrey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: teal[500],
    },
    secondary: {
      main: amber[500],
    },
    success: {
      main: lime[500],
    },
    background: {
      default: '#0e192b',
      paper: blueGrey[800], // Change this to a more aesthetic color
    },
    text: {
      primary: '#fff',
      secondary: grey[500],
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#fff',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#fff',
    },
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 400,
      color: grey[400],
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 300,
      color: grey[500],
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(to right, #1e3c72, #2a5298)', // Gradient background for the body
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent', // Make Paper component backgrounds transparent to show the gradient
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: lime[500],
          color: '#000',
        },
        outlinedPrimary: {
          borderRadius: 20,
          borderColor: '#fff',
          color: '#fff',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.size === "large" && {
            width: 100,
            height: 100,
          }),
          backgroundColor: teal[500],
          color: '#fff',
        }),
      },
      defaultProps: {
        size: "medium",
      },
      variants: [
        {
          props: { variant: "circular" },
          style: {
            borderRadius: 50,
          },
        },
      ],
    },
  },
});

export default responsiveFontSizes(theme);

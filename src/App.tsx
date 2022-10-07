import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { grey } from '@mui/material/colors';

import Dashboard from './Dashboard';
import TodoPage from './TodoPage';
import Header from './components/Header';
import { store } from './store/store';

declare module '@mui/material/styles' {
  interface TypeText {
    white: string;
    light: string;
  } 
}

let theme = createTheme({
  typography: {
    "fontFamily": "'Montserrat',sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: "600",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "600",
    },
    h3: {
      fontSize: "1.7rem",
      fontWeight: "600",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: "600",
    },
    h4: {
      fontSize: "1.4rem",
      fontWeight: "600",
    },
    h6: {
      fontSize: "1.2rem",
      fontWeight: "600",
    },
  },
  palette: {
    text: {
      white: "#ffffff",
      light: grey[600],
    },
    secondary: {
      main: "#1f5993",
    }
  },
});
theme = responsiveFontSizes(theme);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Header /><Dashboard /></>
    },
    {
      path: "todo/:id",
      element: <><Header /><TodoPage /></>
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.grey[100] }}>
            <Container maxWidth="lg" sx={{ pt: theme.spacing(12), pb: theme.spacing(9) }}>
              <RouterProvider router={router} />
            </Container>
          </Box>
          <ToastContainer autoClose={2000} theme="colored" />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
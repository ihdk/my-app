import { useMatch } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { Link, Stack, AppBar, Container, Toolbar, Typography, Grid, Button } from '@mui/material';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import HomeIcon from '@mui/icons-material/Home';

/**
 * Renders header of app
 */
const Header = () => {
  const theme = useTheme();
  
  /** Check if is opened dashboard page */
  const isDashboard = useMatch('/') !== null;

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Container maxWidth="lg" sx={{ [theme.breakpoints.down('md')]: { p: theme.spacing(1, 0) } }}>
          <Grid container spacing={0} alignItems="center">
            <Grid item xs={10}>
              <Link href="/" underline="none" color="inherit" >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center"}} >
                  <SpeakerNotesIcon fontSize="large" sx={{ color: "#ffffff" }}/>
                  <Stack 
                    direction={{ xs: "column", md: "row" }} 
                    spacing={{ xs: 0, md: 1 }} 
                    sx={{ alignItems: "flex-end" , [theme.breakpoints.down('md')]: { alignItems: "flex-start" } }} 
                  >
                    <Typography component="div" variant="h2" color="#ffffff">AMCEF demo</Typography>
                    <Typography component="div" color="#ffffff" sx={{ opacity: 0.5 }}>/ my TODO list</Typography>
                  </Stack>
                </Stack>
              </Link>
            </Grid>
            { !isDashboard && 
              <Grid item xs={2} sx={{ textAlign: "right" }} >
                <Button href="/" color="inherit" startIcon={<HomeIcon />} sx={{ [theme.breakpoints.down('md')]: { display: "none" } }} >Dashboard</Button>
                <Button href="/" color="inherit" sx={{ display: "none", [theme.breakpoints.down('md')]: { display: "inline-flex" } }}><HomeIcon /></Button>
              </Grid>
            }
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );

}

export default Header;
import React from "react";
import { Grid, Paper, Container, Toolbar, Box } from "@mui/material";
import Chart from "./Chart";
import PizzaChart from "./PizzaChart";
import BarraChart from "./BarraChart";
import Deposits from "./Deposits";
import Orders from "./Orders";

const DashboardContent: React.FC = () => (
  <Box
    component="main"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
    }}
  >
    <Toolbar />
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={12} lg={5}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 280,
            }}
          >
            <PizzaChart />
          </Paper>
        </Grid>
        {/* <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid> */}
        {/* Recent Deposits */}
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 350,
            }}
          >
            <BarraChart />
            {/* <Deposits /> */}
          </Paper>
        </Grid>
        {/* Recent Orders */}
        {/* <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Orders />
          </Paper>
        </Grid> */}
      </Grid>
    </Container>
  </Box>
);

export default DashboardContent;

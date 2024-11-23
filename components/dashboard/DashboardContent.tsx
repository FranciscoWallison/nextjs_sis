import React from "react";
import { Grid, Paper, Container, Box } from "@mui/material";
import PizzaChart from "./PizzaChart";
import BarraChart from "./BarraChart";

const DashboardContent: React.FC = () => (
  <Box
    component="main"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      minHeight: "100vh", // Garante que o conteúdo ocupe pelo menos a altura total
      overflow: "auto",
      padding: { xs: 2, sm: 4 }, // Padding dinâmico
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Gráfico de Pizza */}
        <Grid item xs={12} md={6} lg={5}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Centraliza o conteúdo verticalmente
              alignItems: "center", // Centraliza horizontalmente
              height: "auto", // Altura dinâmica
            }}
          >
            <PizzaChart />
          </Paper>
        </Grid>

        {/* Gráfico de Barra */}
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "auto", // Altura dinâmica
              maxWidth: "100%", // Responsividade
              overflow: "hidden", // Evita overflow do conteúdo
            }}
          >
            <BarraChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default DashboardContent;

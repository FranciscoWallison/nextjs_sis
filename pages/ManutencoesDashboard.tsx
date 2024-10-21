import React, { useState } from "react";
import { Box, Button, Container, Grid } from "@mui/material";
import Manutencoes from "@/components/Manutencoes";
import Periodicidades from "@/components/Periodicidades";
import MainLayout from "@/components/layout/MainLayout";
import withAuth from "@/hoc/withAuth";

const ManutencoesDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"manutencoes" | "periodicidades">("manutencoes");

  return (
    <MainLayout title="Manutenções">
      <Container>
        <Grid container spacing={2} sx={{ mb: 4 , mt: 2 }} >
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={selectedTab === "manutencoes" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("manutencoes")}
            >
              Manutenções Cadastradas
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={selectedTab === "periodicidades" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("periodicidades")}
            >
              Adicionar Manutenções
            </Button>
          </Grid>
        </Grid>

      
          {selectedTab === "manutencoes" && <Manutencoes />}
          {selectedTab === "periodicidades" && <Periodicidades />}
      
      </Container>
    </MainLayout>
  );
};

export default withAuth(ManutencoesDashboard);

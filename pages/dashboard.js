// pages/dashboard.js

import { useState, useEffect } from "react";
import ColumnChart from "./components/ColumnChart"; // Importação corrigida
import PizzaChart from "./components/PizzaChart"; // Importação corrigida
import DashboardLayout from "./components/DashboardLayout"; // Importação corrigida
import { Grid } from "@mui/material";
import axios from "axios";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    ano: "2024",
    mes: "",
    tipoEquipamento: "",
    equipamento: "",
    area: "",
    responsavel: "",
  });
  const [manutencoes_programadas, setManutencoes_programadas] = useState([]);

  useEffect(() => {
    applyFilters(); // Carregar os dados iniciais ao montar a página
  }, []);

  const applyFilters = async () => {
    try {
      const response = await axios.get(
        `/api/manutencoes_teste?periodoInicio=2024-01-01&periodoFim=2024-12-31`
      );
      setManutencoes_programadas(response.data);
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error);
      setManutencoes_programadas([]);
    }
  };

  const handleOpenFilters = () => {
    // Implementar a lógica para abrir os filtros (exemplo)
    console.log("Abrir filtros");
  };

  return (
    <DashboardLayout handleOpenFilters={handleOpenFilters}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PizzaChart data={manutencoes_programadas} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ColumnChart data={manutencoes_programadas} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

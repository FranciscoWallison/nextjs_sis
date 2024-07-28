import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import MaintenanceCategory from "../components/MaintenanceCategory";
import withAuth from "../hoc/withAuth";
import MainLayout from "../components/layout/MainLayout";

import { pegarUsuarioPeriodicidades } from "@/services/firebaseService";

interface ResponsibleInfo {
  nome: string;
  telefone: string;
  email: string;
}

interface Activity {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: ResponsibleInfo;
}

interface CategoryData {
  title: string;
  data: Activity[];
}

const Manutencoes: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const responseP = await pegarUsuarioPeriodicidades();

      setData(responseP.questions);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <MainLayout title={"Manutenção"}>
      <Container>
        {/* <Typography variant="h3" component="div" gutterBottom>
        Atividades de Manutenção
      </Typography> */}
        {data.map((category, index) => (
          <MaintenanceCategory
            key={index}
            category={category.title}
            activities={category.data}
          />
        ))}
      </Container>
    </MainLayout>
  );
};

export default withAuth(Manutencoes);

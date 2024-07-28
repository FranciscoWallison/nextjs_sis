import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, LinearProgress, Box } from "@mui/material";
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
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
  id: number;
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
      console.log('====================================');
      console.log(responseP.questions);
      console.log('====================================');

      const sortedData = sortActivities(responseP.questions);
      setData(sortedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const sortActivities = (data: CategoryData[]): CategoryData[] => {
    return data.map(category => {
      const sortedData = category.data.sort((a, b) => {
        const aDone = !!a.data || a.nao_lembro || a.nao_feito;
        const bDone = !!b.data || b.nao_lembro || b.nao_feito;
        return aDone === bDone ? 0 : aDone ? 1 : -1;
      });
      return { ...category, data: sortedData };
    });
  };

  const calculateProgress = (): number => {
    let totalActivities = 0;
    let completedActivities = 0;

    data.forEach(category => {
      totalActivities += category.data.length;
      category.data.forEach(activity => {
        if (activity.data || activity.nao_lembro || activity.nao_feito) {
          completedActivities++;
        }
      });
    });

    if (totalActivities === 0) return 0;

    return (completedActivities / totalActivities) * 100;
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  const progress = calculateProgress();

  return (
    <MainLayout title={"Manutenção"}>
      <Container>
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}% completado`}</Typography>
        </Box>
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

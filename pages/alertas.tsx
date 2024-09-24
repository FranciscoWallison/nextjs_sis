import React, { useState, useEffect } from "react";
import { getStatus } from "@/utils/statusHelper";
import HelpActivity from "@/utils/HelpActivity";
import {
  Activity,
  pegarUsuarioPeriodicidades,
} from "@/services/firebaseService";
import withAuth from "@/hoc/withAuth";
import {
  Alert,
  Box,
  Typography,
  List,
  ListItem,
  Modal,
  Container,
} from "@mui/material";
import EditActivityModal from "@/components/EditActivityModal"; // Importa o novo modal
import AlertTitle from "@mui/material/AlertTitle";
import MainLayout from "../components/layout/MainLayout";

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  useEffect(() => {
    const fetchActivities = async () => {
      const activities: any = await pegarUsuarioPeriodicidades();

      const alertsToShow = await Promise.all(
        activities.questions.map(async (activity: Activity) => {
          const dataStatus = await getStatus(activity);
          const dueDate = HelpActivity.formatDateToDDMMYYYY(activity);
          if (
            dataStatus.status === "Vencido" ||
            dataStatus.status === "A vencer"
          ) {
            return { ...activity, status: dataStatus.status, dueDate };
          }
          return null;
        })
      );
      setAlerts(alertsToShow.filter(Boolean) as Activity[]);
    };

    fetchActivities();
  }, []);

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity); // Abre o modal com a atividade selecionada
  };

  const handleCloseEditActivity = () => {
    setSelectedActivity(null); // Fecha o modal
  };

  return (
    <MainLayout title="Alertas">
      <Container>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Alertas de Atividades
          </Typography>
          <List>
            {alerts.map((activity) => (
              <ListItem
                key={activity.id}
                button
                onClick={() => handleEditActivity(activity)}
              >
                <Alert
                  severity={activity.status === "Vencido" ? "error" : "warning"}
                >
                  <AlertTitle>{activity.titulo} </AlertTitle>
                  Status: {activity.status} - Vencimento: {activity.dueDate}
                </Alert>
              </ListItem>
            ))}
          </List>

          {selectedActivity && (
            <EditActivityModal
              open={!!selectedActivity}
              activity={selectedActivity}
              onClose={handleCloseEditActivity}
              onSave={(updatedActivity) => {
                // Atualiza a atividade após salvar
                setAlerts((prev) =>
                  prev.map((act) =>
                    act.id === updatedActivity.id ? updatedActivity : act
                  )
                );
                handleCloseEditActivity();
              }}
            />
          )}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default withAuth(AlertsPage);

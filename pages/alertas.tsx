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
  Snackbar,
} from "@mui/material";
import EditActivityModal from "@/components/EditActivityModal"; // Importa o novo modal
import AlertTitle from "@mui/material/AlertTitle";
import MainLayout from "../components/layout/MainLayout";

// Cria um novo tipo que estende Activity e inclui status e dueDate
interface AlertActivity extends Activity {
  status: string;
  dueDate: string;
}

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertActivity[]>([]);
  const [selectedActivity, setSelectedActivity] =
    useState<AlertActivity | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const activities: any = await pegarUsuarioPeriodicidades();

    const alertsToShow = await Promise.all(
      activities.questions.map(async (activity: Activity) => {
        const dataStatus = await getStatus(activity);
        const dueDate = await HelpActivity.formatDateToDDMMYYYY(activity); // Usa await para lidar com função assíncrona
        if (
          dataStatus.status === "Vencido" ||
          dataStatus.status === "A vencer"
        ) {
          return { ...activity, status: dataStatus.status, dueDate };
        }
        return null;
      })
    );
    setAlerts(alertsToShow.filter(Boolean) as AlertActivity[]);
  };

  const handleEditActivity = (activity: AlertActivity) => {
    setSelectedActivity(activity); // Abre o modal com a atividade selecionada
  };

  const handleCloseEditActivity = () => {
    setSelectedActivity(null); // Fecha o modal
  };

  const onActivityUpdated = () => {
    setSnackbarOpen(true);
    fetchActivities(); // Atualiza as atividades após edição
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
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
                    severity={
                      activity.status === "Vencido" ? "error" : "warning"
                    }
                  >
                    <AlertTitle>{activity.titulo}</AlertTitle>
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
                onActivityUpdated={onActivityUpdated}
              />
            )}
          </Box>
        </Container>
      </MainLayout>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Atividade atualizada com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default withAuth(AlertsPage);

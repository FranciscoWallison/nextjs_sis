import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Modal,
  Box,
  List,
  ListItem,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotification } from "@/contexts/NotificationContext"; // Importa o hook do contexto
import HelpActivity from "@/utils/HelpActivity";
import EditActivityModal from "@/components/EditActivityModal"; // Importa o novo modal
import { Activity } from "@/services/firebaseService"; // Certifique-se de importar o tipo `Activity`

interface HeaderProps {
  open: boolean;
  title: string;
  toggleDrawer: () => void;
  drawerWidth: number;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  open,
  toggleDrawer,
  title,
  drawerWidth,
}) => {
  const { notificationCount, alerts, fetchNotifications } = useNotification(); // Usa o contexto e adiciona a função de recarregar notificações
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null); // Atividade selecionada para editar
  const [localAlerts, setLocalAlerts] = useState<Activity[]>([]); // Renomeando para localAlerts
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const handleNotificationClick = () => {
    setNotificationsOpen(true); // Abre o modal de notificações
  };

  const handleCloseNotifications = () => {
    setNotificationsOpen(false); // Fecha o modal de notificações
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity); // Define a atividade para ser editada
  };

  const handleCloseEditActivity = () => {
    setSelectedActivity(null); // Fecha o modal de edição de atividade
  };

  const onActivityUpdated = async () => {
    setSnackbarOpen(true);
    await fetchNotifications(); // Recarrega as notificações após a atualização da atividade
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <AppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: "24px" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ marginRight: "36px", ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={notificationCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Modal de Notificações */}
      <Modal open={isNotificationsOpen} onClose={handleCloseNotifications}>
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            margin: "auto",
            mt: 8,
          }}
        >
          <Typography variant="h6">Notificações</Typography>
          <List>
            {alerts.map((activity: Activity) => (
              <ListItem
                button
                key={activity.id}
                onClick={() => handleEditActivity(activity)} // Abre o modal de edição ao clicar
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
        </Box>
      </Modal>

      {/* Modal de Edição de Atividade */}
      {selectedActivity && (
        <EditActivityModal
          open={!!selectedActivity}
          activity={selectedActivity}
          onClose={handleCloseEditActivity}
          onActivityUpdated={onActivityUpdated}
        />
      )}

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Atividade atualizada com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;

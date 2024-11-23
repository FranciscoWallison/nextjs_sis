import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Alert,
  AlertTitle,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotification } from "@/contexts/NotificationContext";
import EditActivityModal from "@/components/EditActivityModal";
import { Activity } from "@/services/firebaseService";

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
  const { notificationCount, alerts, fetchNotifications } = useNotification();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Estado para ancorar o menu
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detecta se a tela é mobile

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

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.left });
    setAnchorEl(event.currentTarget); // Define o ícone como elemento âncora do menu
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null); // Fecha o menu
    setMenuPosition(null); // Reseta a posição do menu
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    handleCloseNotifications(); // Fecha o menu ao editar
  };

  const onActivityUpdated = async () => {
    setSnackbarOpen(true);
    await fetchNotifications();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <AppBar position="absolute" open={open}>
        <Toolbar sx={{
          pr: "24px", // Padding direito
          ...((isMobile && open) && { display: "none" }), // Exemplo de ajuste no mobile
        }}>
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

      {/* Menu de Notificações */}
      <Menu
        id="notification-menu"
        anchorEl={anchorEl} // Define o elemento de ancoragem do menu
        open={Boolean(anchorEl)} // Menu é aberto se houver um âncora definido
        onClose={handleCloseNotifications} // Fecha o menu ao clicar fora ou selecionar uma notificação
        anchorReference="anchorPosition" // Usar referência de posição
        anchorPosition={
          menuPosition ? { top: menuPosition.top, left: menuPosition.left } : undefined
        }
        keepMounted // Mantém o menu montado para evitar problemas de posicionamento
      >
        {/* {isMobile && (
          <MenuItem onClick={handleCloseNotifications}>
            <Typography variant="body2" color="textSecondary">
              Fechar
            </Typography>
          </MenuItem>
        )} */}

        {/* Verifica se há notificações */}
        {alerts.length > 0 ? (
          alerts.map((activity: Activity) => (
            <MenuItem
              key={activity.id}
              onClick={() => handleEditActivity(activity)}
            >
              <Alert
                severity={activity.status === "Vencido" ? "error" : "warning"}
                sx={{ width: "100%" }}
              >
                <AlertTitle>{activity.titulo}</AlertTitle>
                Status: {activity.status} - Vencimento: {activity.dueDate}
              </Alert>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography variant="body2" color="textSecondary">
              Nenhuma notificação disponível
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Modal de Edição de Atividade */}
      {selectedActivity && (
        <EditActivityModal
          open={!!selectedActivity}
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
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

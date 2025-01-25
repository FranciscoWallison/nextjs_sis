import React from "react";
import {
  List,
  Divider,
  IconButton,
  Toolbar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Ícone para o botão de sair
import { MainListItems, secondaryListItems } from "./listItems";
import { styled, Theme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { usePageContext } from "@/contexts/PageContext";
import { useRouter } from "next/router";

interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  toggleDrawer,
  drawerWidth,
}) => {
  const { pages } = usePageContext();
  const router = useRouter();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm")); // Detecta se é mobile

  const handleLogoff = () => {
    // Limpa o localStorage
    localStorage.clear();

    // Redireciona para a página de login
    router.push("/login");
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => {
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detecta se a tela é mobile

    return {
      display: isMobile && !open ? "none" : "block",  // Esconde no mobile quando fechado
      width: isMobile && open ? "100%" : "auto",
      "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: isMobile
          ? open
            ? "100% !important"  // Abre em tela cheia no mobile
            : "0px"              // Esconde quando fechado
          : open
            ? `${drawerWidth}px`
            : theme.spacing(7),
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(isMobile && open && {
          width: "100% !important", // Largura total para mobile quando expandido
        }),
        ...(!open && {
          overflowX: "hidden",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: isMobile ? "0px" : theme.spacing(7), // Esconde no mobile, mantém no desktop
          [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9),
          },
        }),
      },
    };
  });



  return (
    <Drawer variant={"permanent"} open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav" sx={{ flexGrow: 1 }}>
        <MainListItems pages={pages} />
        <Divider sx={{ my: 1 }} />
        {secondaryListItems}
      </List>

      {/* Botão de Logoff no rodapé do menu lateral */}
      <Box sx={{ mt: "auto", p: 2 }}>
        {open ? (
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleLogoff}
          >
            Sair
          </Button>
        ) : (
          <IconButton color="secondary" onClick={handleLogoff}>
            <ExitToAppIcon />
          </IconButton>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;

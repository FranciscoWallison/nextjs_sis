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
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const handleLogoff = () => {
    localStorage.clear();
    router.push("/login");
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    display: isMobile && !open ? "none" : "block",
    width: isMobile && open ? "100%" : "auto",
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: isMobile
        ? open
          ? "100% !important"
          : "0px"
        : open
        ? `${drawerWidth}px`
        : theme.spacing(7),
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(isMobile &&
        open && {
          width: "100% !important",
        }),
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: isMobile ? "0px" : theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  }));

  const isActivePage = (path: string) => router.pathname === path;

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
        {pages.map((page) => (
          <ListItemButton
            key={page.url} // Key exclusiva
            selected={isActivePage(page.url)} // Marca como selecionado
            sx={{
              backgroundColor: isActivePage(page.url)
                ? "primary.main"
                : "inherit",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            }}
            onClick={() => router.push(page.url)}
          >
            <ListItemIcon
              sx={{ color: isActivePage(page.url) ? "white" : "inherit" }}
            >
              <page.icon /> {/* Renderiza o ícone corretamente */}
            </ListItemIcon>
            <ListItemText primary={page.title} />
          </ListItemButton>
        ))}
      </List>

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

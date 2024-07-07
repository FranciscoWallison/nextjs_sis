import React from "react";
import {
  List,
  Divider,
  IconButton,
  Toolbar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MainListItems, secondaryListItems } from "./listItems";
import { styled } from "@mui/material/styles";
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

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  }));

  return (
    <Drawer variant="permanent" open={open}>
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
      <List component="nav">
        <MainListItems pages={pages} />

        <Divider sx={{ my: 1 }} />
        {secondaryListItems}
      </List>
    </Drawer>
  );
};

export default Sidebar;

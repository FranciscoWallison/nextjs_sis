import React from "react";
import { Box, CssBaseline, Container, Toolbar } from "@mui/material";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Copyright from "@/components/layout/Copyright";
import { useAuth } from "@/contexts/AuthContext";
import LogoffButton from "@/components/layout/LogoffButton";
const drawerWidth: number = 240;

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { open, setOpen } = useAuth();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header
        open={open}
        toggleDrawer={toggleDrawer}
        title={title}
        drawerWidth={drawerWidth}
      />
      <Sidebar
        open={open}
        toggleDrawer={toggleDrawer}
        drawerWidth={drawerWidth}
      />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
          <Copyright sx={{ pt: 4 }} />
        </Container>
        
      </Box>
      
    </Box>
  );
};

export default MainLayout;

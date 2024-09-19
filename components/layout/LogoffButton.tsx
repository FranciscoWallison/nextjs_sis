import React from "react";
import { Button, Box } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

const LogoffButton: React.FC = () => {
  const { logoff } = useAuth(); // Função de logoff do seu contexto de autenticação
  const router = useRouter();

  const handleLogoff = () => {
    logoff(); // Realiza o logoff
    router.push("/login"); // Redireciona para a página de login
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        p: 2,
        backgroundColor: "background.paper", // Usar cor de fundo do tema
        boxShadow: "0px -1px 6px rgba(0,0,0,0.1)", // Sombra no topo do rodapé
      }}
    >
      <Button variant="contained" color="secondary" onClick={handleLogoff}>
        Sair
      </Button>
    </Box>
  );
};

export default LogoffButton;

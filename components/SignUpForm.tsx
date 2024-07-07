import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useAuth } from "@/contexts/AuthContext";

const SignUpForm: React.FC = () => {
  const { createUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await createUser({ name, email, password });
      mensagem(response);
    } catch (err) {
      setError("Erro ao realizar cadastro.");
    }
  };

  const mensagem = (response: boolean) => {
    if (response) {
      setSuccess("Cadastro realizado com sucesso!");

      setName("");
      setEmail("");
      setPassword("");

      setError("");
    } else {
      setError("Erro ao realizar cadastro.");
      setSuccess("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="green">{success}</Typography>}
      </Box>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nome Completo"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Senha"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Inscrever-se
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="/login" variant="body2">
            Já tem uma conta? Entrar
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUpForm;

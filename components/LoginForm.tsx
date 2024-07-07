import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await login({ email, password });
      mensagem(response);
    } catch (err) {
      setError("Login ou senha inválidos!");
    }
  };

  const mensagem = (response: boolean) => {
    if (response) {
      // setSuccess("Informações invalidas!");
      setEmail("");
      setPassword("");

      setError("");
    } else {
      setError("Login ou senha inválidos!");
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
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
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
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        ENTRAR
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="/signup" variant="body2">
            Cadastrar
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;

import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Grid, Link } from "@mui/material";
import NextLink from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await login({ email, password });
      if (response) {
        setEmail("");
        setPassword("");
        setError("");
        setSuccess("Login realizado com sucesso!");
      } else {
        setError("Login ou senha inválidos!");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    }
    setIsSubmitting(false);
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
        {success && <Typography color="success.main">{success}</Typography>}
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Aguarde..." : "ENTRAR"}
      </Button>

      <Grid container justifyContent="space-between">
        <Grid item>
          <NextLink href="/recuperarSenha" passHref>
            <Link variant="body2">Esqueceu a senha?</Link>
          </NextLink>
        </Grid>
        <Grid item>
          <NextLink href="/signup" passHref>
            <Link variant="body2">Cadastrar</Link>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;

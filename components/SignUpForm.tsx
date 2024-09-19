import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import NextLink from "next/link"; // Para usar Next.js Link
import { useAuth } from "@/contexts/AuthContext";

const SignUpForm: React.FC = () => {
  const { createUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Para controle de hidratação

  // Certifica-se de que a renderização é apenas no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Evita problemas de renderização SSR
  }

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createUser({ name, email, password });
      handleResponse(response);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResponse = (response: boolean) => {
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
        {success && <Typography color="success.main">{success}</Typography>}
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Aguarde..." : "Inscrever-se"}
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <NextLink href="/login" passHref>
            <Link component="a" variant="body2">
              Já tem uma conta? Entrar
            </Link>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUpForm;

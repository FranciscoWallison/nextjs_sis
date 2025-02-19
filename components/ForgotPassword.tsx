import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import NextLink from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      await resetPassword(email);
      setMessage("Se o e-mail estiver cadastrado, um link de redefinição será enviado.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: { xs: "100%", sm: "400px" },
        mx: "auto",
      }}
    >

      <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ mb: 2 }}>
        Digite seu e-mail para receber um link de redefinição de senha.
      </Typography>

      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="success.main">{message}</Typography>}

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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar Link"}
      </Button>

      <Grid container justifyContent="center">
        <Grid item>
          <NextLink href="/login" passHref>
            <Typography variant="body2" component="span" sx={{ cursor: "pointer", textDecoration: "underline", color: "primary.main" }}>
              Voltar para Login
            </Typography>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;

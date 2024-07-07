import React from "react";
import { Container, Box, Typography } from "@mui/material";
import SignUpForm from "../components/SignUpForm";
import withAuthRedirect from '../hoc/withAuthRedirect';

const SignUpPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Inscrever-se
        </Typography>
        <SignUpForm />
      </Box>
    </Container>
  );
};

export default withAuthRedirect(SignUpPage);

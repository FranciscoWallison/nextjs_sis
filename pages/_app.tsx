import React from "react";
import { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageProvider } from "@/contexts/PageContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PageProvider>
          <Component {...pageProps} />
        </PageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;

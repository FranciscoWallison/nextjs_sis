import React from "react";
import { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageProvider } from "@/contexts/PageContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProviderWrapper } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProviderWrapper>
      <CssBaseline />
      <AuthProvider>
        <PageProvider>
          <NotificationProvider>
            <Component {...pageProps} />
          </NotificationProvider>
        </PageProvider>
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}

export default MyApp;

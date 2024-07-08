import React from "react";
import { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageProvider } from "@/contexts/PageContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProviderWrapper } from '@/contexts/ThemeContext';

import { theme } from "@/utils/Theme";


function MyApp({ Component, pageProps }: AppProps) {
  // console.log('============MyApp=============');
  // console.log( JSON.stringify(theme) );
  // console.log('====================================');
  return (
    <ThemeProviderWrapper>
      <CssBaseline />
      <AuthProvider>
        <PageProvider>
          <Component {...pageProps} />
        </PageProvider>
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}

export default MyApp;

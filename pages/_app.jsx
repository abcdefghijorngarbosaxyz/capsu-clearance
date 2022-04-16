import "../styles/globals.css";
import React from "react";
import { ThemeProvider } from "next-themes";
import "../styles/nprogress.css";
import Router from "next/router";
import Nprogress from "nprogress";
import { SessionProvider } from "next-auth/react";

Nprogress.configure({ showSpinner: false });

Router.onRouteChangeStart = () => {
  Nprogress.start();
};

Router.onRouteChangeComplete = () => {
  Nprogress.done();
};

Router.onRouteChangeError = () => {
  Nprogress.done();
};

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <ThemeProvider enableSystem={true} attribute="class">
        <>
          <Component {...pageProps} />
        </>
      </ThemeProvider>
    </SessionProvider>
  );
}

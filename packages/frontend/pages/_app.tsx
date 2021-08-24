/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import Router from "next/router";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "bootstrap/dist/css/bootstrap.min.css";
import "shaka-player/dist/controls.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "components/main.sass";
import { fkUser, getUserProfile } from "components/TS-API/API";
import { UserContext, UserContextLoggedInState, UserContextUnauthState } from "../components/UserContext";
import { Header } from "modules/core/components/Header";
import { Global, ThemeProvider } from "@emotion/react";
import { global } from "modules/styling/global";
import { lightTheme } from "modules/styling/themes";
import { Body } from "modules/core/components/Body";

Sentry.init({
  dsn: "https://41ab0b4801094dfd8ecd84eafc947380@o310671.ingest.sentry.io/5701229",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<fkUser | null>(null);

  const refresh = (authToken: string): void => {
    getUserProfile(authToken)
      .then((p) => {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            profile: p,
            token: authToken,
          })
        );
        setProfile(p);
      })
      .catch((problem) => {
        throw problem;
      });
  };

  const logout = (): void => {
    localStorage.removeItem("userData");
    setToken(undefined);
    Router.push("/")
      .then()
      .catch((problem) => {
        throw problem;
      });
  };
  const login = (withToken: string): void => {
    setToken(withToken);
  };
  useEffect(() => {
    if (token == null) {
      setProfile(null);
      return;
    }
    if (profile == null) {
      refresh(token);
    }
  }, [token, profile]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData") || "null") as {
      token: string;
      profile: fkUser;
    };
    if (storedData?.token) {
      setProfile(storedData.profile);
      setToken(storedData.token);
    }
  }, []);

  return (
    <UserContext.Provider
      value={
        token
          ? ({ isLoggedIn: true, refresh, token, profile, login, logout } as UserContextLoggedInState)
          : ({ isLoggedIn: false, login } as UserContextUnauthState)
      }
    >
      <ThemeProvider theme={lightTheme}>
        <Global styles={global} />
        <Header />
        <Body>
          <Component {...pageProps} />
        </Body>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

MyApp.defaultProps = {
  children: <></>,
};

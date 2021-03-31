/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import Router from "next/router";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "bootstrap/dist/css/bootstrap.min.css";
import "shaka-player/dist/controls.css";
import "shaka-player/dist/demo.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "components/main.sass";
import PropTypes from "prop-types";

import { getUserProfile } from "components/TS-API/API";
import { UserContext } from "../components/UserContext";

Sentry.init({
  dsn: "https://41ab0b4801094dfd8ecd84eafc947380@o310671.ingest.sentry.io/5701229",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

function MyApp({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const login = (token) => {
    setToken(token);
  };
  const refresh = () => {
    getUserProfile(token).then((p) => {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          profile: p,
          token: token,
        })
      );
      setProfile(p);
    });
  };
  const logout = () => {
    localStorage.removeItem("userData");
    setToken(null);
    Router.push("/");
  };
  useEffect(() => {
    if (token == null) {
      setProfile(null);
      return;
    }
    if (profile == null) {
      refresh();
    }
  }, [token]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      setProfile(storedData.profile);
      login(storedData.token);
    }
  }, []);
  return (
    <UserContext.Provider
      value={{ isLoggedIn: !!token, refresh, token: token, profile: profile, login: login, logout: logout }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.shape),
};

MyApp.defaultProps = {
  pageProps: {},
};

export default MyApp;

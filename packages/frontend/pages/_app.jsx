/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState, useEffect } from "react";
import Router from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import "shaka-player/dist/controls.css";
import "shaka-player/dist/demo.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "components/main.sass";
import PropTypes from "prop-types";
import config from "components/configs";
import fetch from "isomorphic-unfetch";

import { getUserProfile } from "components/TS-API/API";
import { UserContext } from "../components/UserContext";

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

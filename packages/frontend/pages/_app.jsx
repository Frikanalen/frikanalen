/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shaka-player/dist/controls.css";
import "shaka-player/dist/demo.css";
import "components/main.sass";
import PropTypes from "prop-types";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.shape),
};

MyApp.defaultProps = {
  pageProps: {},
};

export default MyApp;

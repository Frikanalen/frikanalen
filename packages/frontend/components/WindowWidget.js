import React from "react";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";

import styles from "./WindowWidget.module.sass";

export default function WindowWidget({ nomargin, invisible, children }) {
  const containerStyle = nomargin ? styles.BareWindowWidget : null;
  const backgroundStyle = invisible ? styles.InvisibleWindowWidget : null;

  return (
    <Container fluid="lg" className={[styles.WindowWidget, containerStyle, backgroundStyle]}>
      {children}
    </Container>
  );
}

WindowWidget.propTypes = {
  invisible: PropTypes.bool,
  nomargin: PropTypes.bool,
  children: PropTypes.node,
};

WindowWidget.defaultProps = {
  invisible: false,
  nomargin: false,
  children: null,
};

import React from "react";
import Container from "react-bootstrap/Container";
import styles from "./WindowWidget.module.sass";

interface WindowWidgetProps {
  invisible?: boolean;
  nomargin?: boolean;
  children?: React.ReactNode;
}

export default function WindowWidget({ nomargin, invisible, children }: WindowWidgetProps) {
  const containerStyle = nomargin ? styles.BareWindowWidget : "";
  const backgroundStyle = invisible ? styles.InvisibleWindowWidget : "";

  return (
    <Container fluid="lg" className={`${styles.WindowWidget} ${containerStyle} ${backgroundStyle}`}>
      {children}
    </Container>
  );
}

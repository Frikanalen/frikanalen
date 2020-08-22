import Link from "next/link";
import Header from "./Header";
import MetaTags from "react-meta-tags";

import styles from "./WindowWidget.module.sass";

import Col from "react-bootstrap/Row";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

const WindowWidget = (props) => {
  const containerStyle = props.nomargin ? styles.BareWindowWidget : null;
  const backgroundStyle = props.invisible ? styles.InvisibleWindowWidget : null;

  return (
    <Container
      fluid="lg"
      className={[styles.WindowWidget, containerStyle, backgroundStyle]}
    >
      {props.children}
    </Container>
  );
};

export default WindowWidget;

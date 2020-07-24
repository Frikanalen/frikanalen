import Link from 'next/link'
import Header from './Header'
import MetaTags from 'react-meta-tags'

import styles from './WindowWidget.module.sass'

import Col from 'react-bootstrap/Row'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

const WindowWidget = props => {
    var containerStyle;

    containerStyle = props.nomargin ? styles.BareWindowWidget : styles.WindowWidget

    return (
	<Container fluid="lg" className={containerStyle}>
	{props.children}
	</Container>
)}

export default WindowWidget

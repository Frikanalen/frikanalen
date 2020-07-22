import Link from 'next/link'
import Header from './Header'
import MetaTags from 'react-meta-tags'

import styles from './WindowWidget.module.sass'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

const WindowWidget = props => (
	<Container className={styles.WindowWidget}>
	<Row>
	{props.children}
	</Row>
	</Container>
)

export default WindowWidget

import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'
import LiveVideoPlayer from './LiveVideoPlayer.js'
import ScheduleInfo from './ScheduleInfo.js'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'
import dynamic from 'next/dynamic';

const ShakaPlayer = dynamic(
  () => import('shaka-player-react'), 
  { ssr: false }
);

import WindowWidget from './WindowWidget.js'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

class LiveNow extends Component {
    render = () => {
        const videoJsOptions = {
            autoplay: true,
            controls: true,
            fluid: true,
            sources: [{
                src: '//frikanalen.no/stream/frikanalen/frikanalen.mpd',
                type: 'application/dash+xml',
            }]
        }

        return (
            <WindowWidget nomargin>
            <Container fluid>
            <Row>
            <ShakaPlayer src='https://frikanalen.no/stream/index.mpd' />
            </Row>
            <Row>
            <ScheduleInfo />
            </Row>
            </Container>
            </WindowWidget>
        );
    }
    
}

export default LiveNow;

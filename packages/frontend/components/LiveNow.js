import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'
import LiveVideoPlayer from './LiveVideoPlayer.js'
import ScheduleInfo from './ScheduleInfo.js'
import DASHPlayer from '../components/DASHPlayer.js';

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

class LiveNow extends Component {
    render = () => {
        if (typeof window !== 'undefined') {
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
            <Container className="live-now">
                <Row className="header"><span>direkte nå</span></Row>
                <Row>
                <DASHPlayer manifestUri='https://frikanalen.no/stream/index.mpd' />
                </Row>
                <Row>
                <ScheduleInfo />
                <style jsx global>{`
                    .live-now {
                        color: white;
                        background: #535151;
                        margin-bottom: 20px;
                    }

                    div.row.header {
                        display:block;
                        font-family: 'Roboto', sans-serif;
                        background: #535151;
                        text-align: center;
                        font-size: 18pt;
                        color: #eee;
                    }

                `}</style>
                <style jsx global>{`
                    #live_now>div {
                        padding:0;
                    }
                `}</style>
                </Row>
            </Container>
            );
        } else {
            <Container className="live-now">
                <Row className="header"><span>direkte nå</span></Row>
                <Row>
                </Row>
                <Row>
                <ScheduleInfo />
                </Row>
            </Container>
        }
    }
    
}

export default LiveNow;

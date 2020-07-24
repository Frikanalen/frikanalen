import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'
import LiveVideoPlayer from './LiveVideoPlayer.js'
import ScheduleInfo from './ScheduleInfo.js'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'
import dynamic from 'next/dynamic';

const ShakaPlayer = dynamic(
  () => import('./ShakaPlayer.js'), 
  { ssr: false }
);

import WindowWidget from './WindowWidget.js'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

class LiveNow extends Component {
    render = () => {
        return (
            <WindowWidget nomargin>
            <ShakaPlayer src='https://frikanalen.no/stream/index.m3u8' />
            <ScheduleInfo />
            </WindowWidget>
        );
    }
    
}

export default LiveNow;

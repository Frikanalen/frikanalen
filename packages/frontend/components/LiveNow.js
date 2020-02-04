import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'
import {LiveVideoPlayer, ScheduleInfo} from './LiveVideoPlayer.js'

class LiveNow extends Component {
    render = () => {
        return (
        <div id="live_now">
            <LiveVideoPlayer />
            <div className="header">direkte nå</div>
            <ScheduleInfo />
            <style jsx>{`
                #live_now {
                    color: white;
                    background: #535151;
                }

                #live_now > .header {
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    font-weight: bold;
                }
            `}</style>
        </div>
        );
    }
}

export default LiveNow;

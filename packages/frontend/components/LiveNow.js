import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'
import {LiveVideoPlayer, ScheduleInfo} from './LiveVideoPlayer.js'

class LiveNow extends Component {
    render = () => {
        return (
        <div id="live_now">
            <div className="header">direkte nå</div>
            <LiveVideoPlayer />
            <ScheduleInfo />
            <style jsx>{`
                #live_now {
                    color: white;
                    background: #535151;
                    padding: 0;
                }

                #live_now > .header {
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    font-weight: bold;
                    color: #ddd;
                    font-size: 20pt;
                }
                @media screen and (max-width: 1024px) {
                    #live_now > .header {
                        font-size:14pt;
                    }
                }

            `}</style>
        </div>
        );
    }
}

export default LiveNow;

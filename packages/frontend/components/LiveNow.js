import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'
import {LiveVideoPlayer, ScheduleInfo} from './LiveVideoPlayer.js'
import DASHPlayer from '../components/DASHPlayer.js';
//import VideoPlayer from '../components/VideoJS.js';
//let ShakaPlayer;
//if(typeof window !== 'undefined') {
//    ShakaPlayer = require('shaka-player-react');
//} else {
//    ShakaPlayer = () => {return <></>};
//}

class LiveNow extends Component {

    render = () => {
        const videoJsOptions = {
          autoplay: true,
          controls: true,
            fluid: true,
          sources: [{
              src: '//beta.frikanalen.no/stream/frikanalen/frikanalen.mpd',
              type: 'application/dash+xml',
          }]
        }

            //<VideoPlayer { ...videoJsOptions } />
        return (
        <div id="live_now">
            <div className="header">direkte nå</div>
            <DASHPlayer manifestUri='https://beta.frikanalen.no/stream/dash/pgm/pgm_hi/index.mpd' />
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
            <style jsx global>{`
                #live_now>div {
                    padding:0;
                }
            `}</style>
        </div>
        );
    }
}

export default LiveNow;

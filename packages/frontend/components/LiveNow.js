import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'
import LiveVideoPlayer from './LiveVideoPlayer.js'
import ScheduleInfo from './ScheduleInfo.js'
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
            <div id="live_now">
                <div className="header">direkte nå</div>
                <DASHPlayer manifestUri='https://frikanalen.no/stream/index.mpd' />
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
                        color: #eee;
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
        } else {
            return null
        }
    }
    
}

export default LiveNow;

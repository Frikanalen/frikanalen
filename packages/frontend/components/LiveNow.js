import React, { Component } from 'react';

class LiveVideoPlayer extends Component {
    pause_video = () => {
        this.video.current.pause();
        this.setState({playing: false});
    }
    play_video = () => {
        this.video.current.play();
        this.setState({playing: true});
    }
    constructor(props) {
        super(props);
        this.play_video = this.play_video.bind(this);
        this.pause_video = this.pause_video.bind(this);
        this.video = React.createRef();
        this.button = React.createRef();
        this.state = {
            playing: false,
        }
    }
    render() {
        let button;
        if(!this.state.playing) {
            button = (<><button ref={this.button} onClick={this.play_video} 
                className="material-icons">play_circle_outline</button>
                <style jsx>{`            button:hover {
                color: white;
            }
            button {
                width: 100%;
                height: 100%;
                color: #eee;
                position:absolute;
                background: rgba(0,0,0,0);
                font-size: 200px;
                border: none;
            }
`}</style></>);
        }
        return (
          <div id="live">
            <video ref={this.video} onClick={this.pause_video}
                src="http://icecast.frikanalen.no/frikanalen.webm"></video>
            {button}
            <style jsx>{`
            #live {
                position:relative;
                width: 1024px;
                height: 576px;
            }
            video {
                position:absolute;
                width: 100%;
                height: 100%;
            }
            `}</style>
          </div>
        );
    }
}

const ScheduleInfo = () => (
        <div id="next" className="ontv">
            <div className="ontv-head">
                Next video on TV

            </div>
            <div className="ontv-video">
                <strong>15:28</strong>
                &ndash;
                <a href="/video/624330/">Empo tv - del 37</a>
            </div>

            <div className="ontv-org">
                Organization:
                <a href="/organization/66/">
                    Empo AS
                </a>
                (961686601,
                https://www.empo.no/)
            </div>

            <div className="ontv-editor">
                Editor:
                Gro Tronvold
                (prosjektmedarbeidere@empo.no)
            </div>
        </div>
        )
        

class LiveNow extends Component {
    render = () => {
        return (
        <div id="live_now">
            <LiveVideoPlayer />
        </div>
        );
    }
}

export default LiveNow;

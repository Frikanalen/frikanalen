import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'

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
                width: inherit;
                height: 100%;
                top: 0;
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
                width: 1024px;
                height: 576px;
                }

            #live>.header {
                width: 100%;
                text-align: center;
                font-family: 'Roboto', sans-serif;
                font-weight: 600;
                font-size: 20px;
                padding: 5px;
            }

            #live>video {
                position: absolute;
                width: inherit;
            }
            @media screen and (max-width: 1024px) {
                #live {
                width:100%;
                }
            }
            `}</style>
          </div>
        );
    }
}

class ScheduleInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            ready: false
        }
    }

    async componentDidMount() {
        const query = `
        query {
          fkOnRightNows {
            edges {
              node {
                starttime
                endtime
                name
                orgname
              }
            }
          }
        }
        `;
        const url = "https://dev.frikanalen.no/graphql";
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        };
        const res = await fetch(url, opts)
        const json = await res.json()
        const sched = json.data.fkOnRightNows.edges
        console.log(sched[2].node)
        this.setState({
                before:  sched[2].node,
                current: sched[1].node,
                next:   sched[0].node,
                ready: true,
            })
        // FIXME: This code should somehow run on the timecode coming from the live video,
        // for now, we're just hacking things
        const ms_until_next = new Date(sched[1].node.endtime) - Date.now()
        setTimeout(function(){ this.componentDidMount() }.bind(this), ms_until_next);
    }

    as_HH_mm(datestr) {
        let d = new Date(datestr)
        return(("0" + d.getHours()).slice(-2) + 
            ":" + ("0" + d.getMinutes()).slice(-2));
    }
    render() {
        if(this.state.ready) 
            return ( 
                <div className="onRightNow">
                    <div className="programme previous">
                        <div className="startTime">{ this.as_HH_mm(this.state.before.starttime)}</div>
                        <div className="endTime">{ this.as_HH_mm(this.state.before.endtime)}</div>
                        <div className="organization">{this.state.before.orgname}</div>
                        <div className="name">{ this.state.before.name }</div>
                    </div>
                    <div className="programme current">
                        <div className="startTime">{ this.as_HH_mm(this.state.current.starttime)}</div>
                        <div className="endTime">{ this.as_HH_mm(this.state.current.endtime)}</div>
                        <div className="organization">{this.state.current.orgname}</div>
                        <div className="name">{ this.state.current.name }</div>
                    </div>
                    <div className="programme next">
                        <div className="startTime">{ this.as_HH_mm(this.state.next.starttime)}</div>
                        <div className="endTime">{ this.as_HH_mm(this.state.next.endtime)}</div>
                        <div className="organization">{this.state.next.orgname}</div>
                        <div className="name">{ this.state.next.name }</div>
                    </div>
                <style jsx>{`
                .onRightNow {
                    color: white;
                    background: #555;
                }
                .onRightNow>.programme.current {
                    background: #777;
                }
                .onRightNow>.programme {
                    padding: 10px;
                    display: flex;
                    padding-bottom: 5px;
                }
                .onRightNow>.programme>.startTime::after {
                    content: "–";
                }
                .onRightNow>.programme>.organization {
                    margin: 0 10px;
                }
                .onRightNow>.programme>.organization::after {
                    content: ":";
                }
                .onRightNow>.programme>.endTime {
                    margin-right: 20px;
                }
                `}</style>
                </div>
            )
        else
            return null;
    }
    
}

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

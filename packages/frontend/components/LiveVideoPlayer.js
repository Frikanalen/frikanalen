import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch'

export class LiveVideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.video = React.createRef();
    }
    render() {
        return (
          <div id="live">
            <video ref={this.video} controls onClick={this.pause_video}
                src="http://icecast.frikanalen.no/frikanalen.webm"></video>
            <style jsx>{`

            #live {
                width:100%;
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
                width: inherit;
            }
            @media screen and (max-width: 1024px) {
                #live {
                }
            }
            `}</style>
          </div>
        );
    }
}

export class ScheduleInfo extends Component {
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
        //console.log(sched[2].node)
        this.setState({
                previous:  sched[2].node,
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
        const programme_row = (programme, DOMclass) => {
            return(
                    <div className={"programme " + DOMclass}>
                        <div className="startTime">{ this.as_HH_mm(programme.starttime)}</div>
                        <div className="endTime">{ this.as_HH_mm(programme.endtime)}</div>
                        <div className="organization">{programme.orgname}</div>
                        <div className="name">{ programme.name }</div>
                        <style jsx>{`
                            .programme {
                                font-family: 'Roboto', sans-serif;
                                }
                            .programme.current {
                                background: rgba(0, 0, 0, 0.2);
                            }
                            .programme {
                                padding: 10px;
                                display: flex;
                                padding-bottom: 5px;
                            }
                            .programme>.startTime::after {
                                content: "–";
                            }
                            @media screen and (max-width: 1024px) {
                                .programme {
                                    flex-wrap: wrap;
                                }
                            }
                            .programme>.organization {
                                margin: 0 10px;
                                font-weight: bold;
                            }
                            .programme>.organization::after {
                                content: ":";
                            }
                            .programme>.endTime {
                                margin-right: 20px;
                            }
                            `}</style>
                    </div>
            )
        }

        if(!this.state.ready) return null;

        else {
            return ( 
                <div className="onRightNow">
                { programme_row (this.state.previous, "previous") }
                { programme_row (this.state.current, "current") }
                { programme_row (this.state.next, "next") }
                <style jsx>{`
                .onRightNow {
                    color: white;
                    background: #555;
                }
                `}</style>
                </div>
            )
        }
    }
    
}

export default LiveVideoPlayer;

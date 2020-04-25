import Link from 'next/link';
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
            src="https://frikanalen.no/frikanalen.webm"></video>
            <style jsx>{`

            #live {
                width:100%;
                padding: 0;
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
        var ms_until_next = new Date(sched[1].node.endtime) - Date.now()
        if(ms_until_next < 10000) ms_until_next = 10000
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
                        <span className="startTime">{ this.as_HH_mm(programme.starttime)}</span>
                        <span className="endTime">{ this.as_HH_mm(programme.endtime)}</span>
                        <span className="organization">{programme.orgname}</span>
                        <span className="lineBreak"></span>
                        <span className="name">{ programme.name }</span>
                        <style jsx>{`
                            .programme {
                                font-family: 'Roboto', sans-serif;
                                margin: 0;
                                padding: 10px;
                                display: flex;
                                padding-bottom: 5px;
                                align-content: flex-start;
                                }
                            @media screen and (max-width: 800px) {
                                .programme>.lineBreak {
                                    flex-basis: 100%;
                                    height: 0;
                                }
                            }
                            
                            .programme.current {
                                background: rgba(0, 0, 0, 0.2);
                            }
                            .programme>.endTime::before {
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
                                margin-right: 5px;
                                color: #888;
                            }
                            `}</style>
                    </div>
            )
        }

        if(!this.state.ready) return null;

        else {
            return ( 
                <span className="onRightNow">
                { programme_row (this.state.previous, "previous") }
                { programme_row (this.state.current, "current") }
                { programme_row (this.state.next, "next") }
                <p className="fullScheduleLink"><Link href="/schedule" as="/schedule"><a>vis mer...</a></Link></p>
                <style jsx>{`
                .onRightNow {
                    color: white;
                    background: #555;
                }
                .fullScheduleLink {
                    text-align: center;
                    font-family: 'Roboto', sans-serif;
                    background-color: #666;
                    margin: 0;
                    padding: 5px;
                }
                .fullScheduleLink a {
                    background-color: #555;
                    padding: 5px 10px;
                }
                `}</style>
                </span>
            )
        }
    }
    
}

export default LiveVideoPlayer;

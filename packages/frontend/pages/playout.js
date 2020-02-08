import Layout from '../components/Layout';
import * as env from '../components/constants';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';
//import VideoPlayer from '../components/VideoJS.js';
import DASHPlayer from '../components/DASHPlayer.js';

class Playout extends Component {
    constructor (props) {
        super(props)
        this.state = {
            program: 0
        }
        fetch(
            'https://beta.frikanalen.no/playout/atem/program'
        ).then(
            res=>res.json()
        ).then(json => {
            this.setState({
                program: json.inputIndex
            })
        })
        .catch(e => {
            console.log(e)
        })
    }

    set_input = (input_index) => {
        fetch(
            'https://beta.frikanalen.no/playout/atem/program', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({inputIndex: input_index})
            }
        ).then(
            res=>res.json()
        ).then(json => {
            this.setState({
                program: json.inputIndex
            })
        }).
        catch(e => {
            console.log(e)
        })
    }

    InputButton = (props) => {
        console.log('hiiiii', props.input.index, this.state.program)
        return(
            <div>
            <button className={props.input.index == this.state.program? "active": ""} onClick={() => this.set_input(props.input.index)}>{props.input.name}</button>
            <style jsx>{`
            button {
                margin: 3px;
                color: white;
                font-size: 18pt;
                font-weight: bold;
                border: 2px solid black;
                background: #black;
            }
            button.active {
                background: #F25252;
            }
            `}</style>
            </div>
            )
    }
    Knapperad = (props) => {
        const knapper = props.knapper;
        console.log(knapper)
        const knapperad = knapper.map((knapp) => (
            <this.InputButton key={knapp.index} input={knapp} />
        ))
        return knapperad
    }

    ATEM = () => {
        var inputs = [
            {index: 2, name: "tx1"},
            {index: 3, name: "tx2"},
            {index: 1, name: "tx3"},
            {index: 1000, name: "color bars"},
        ]
        return (
            <div>
            <this.Knapperad knapper={inputs} />
            </div>
        );
    }

    render = () => {
        const videoJsOptions = {
        //  autoplay: true,
          controls: true,
            fluid: true,
          sources: [{
              src: 'https://beta.frikanalen.no/stream/multi-hls/frikanalen.m3u8',
              type: 'application/x-mpegURL'
          }]
                //<VideoPlayer { ...videoJsOptions } />
        }
        return (
            <Layout>
            <div className="playoutControl">
                <div className="header">playout-styring</div>
            <DASHPlayer manifestUri='https://beta.frikanalen.no/stream/dash/multi/multiviewer.mpd' />
                <this.ATEM />
            </div>
            <style jsx global>{`
                .playoutControl >div {
                    padding:0;
                }
                `}</style>
            <style jsx>{`
                .playoutControl > .header {
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    font-weight: bold;
                    color: #F25252;
                    font-size: 20pt;
                    background: black;
                }
                .playout_control {
                    background: #535151;
                    width: 100%;
                    max-width: 1024px;
                    padding: 0;
                }
                video {
                    width: 100%;
                }
                
            `}</style>
            </Layout>
        );
    };
}

export default Playout;

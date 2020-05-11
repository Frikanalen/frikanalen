import Layout from '../components/Layout';
import * as env from '../components/constants';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';
import Realtime from '../components/WebRTC.js';
//import VideoPlayer from '../components/VideoJS.js';
import DASHPlayer from '../components/DASHPlayer.js';

class Playout extends Component {
    constructor (props) {
        super(props)
        this.state = {
            program: 0
        }
        fetch(
            'https://frikanalen.no/playout/atem/program'
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
            'https://frikanalen.no/playout/atem/program', {
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
        return(
            <span>
            <button 
                className={props.input.index == this.state.program? "active": ""}
                onClick={() => this.set_input(props.input.index)}>{props.input.name}</button>
            <style jsx>{`
            button {
                margin: 3px;
                color: white;
                font-size: 18pt;
                font-weight: bold;
                border: 2px solid black;
                background: black;
            }
            button.active {
                background: #F25252;
            }
            @media screen and (max-width: 1024px) {
                button {
                    font-size: 12pt;
                }
            }
            `}</style>
            </span>
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
            <div id="ATEM">
            <label>Programutgang til OBE (NEP):</label>
            <div>
            <this.Knapperad knapper={inputs} />
            </div>
            <style jsx>{`
            #ATEM {
                background: #555;
                color: white;
                display: flex;
                justify-content: space-between;
                align-content: center;
                min-height: 45px;
                border: 3px solid red;
            }
            #ATEM>label {
                margin-left: 5px;
                font-size: 18pt;
                display: inline-block;
                vertical-align: middle;
            }
            @media screen and (max-width: 1024px) {
                #ATEM>label {
                font-size: 12pt;
                }
            }
            `}</style>
            </div>
        );
    }

            //    <DASHPlayer manifestUri="https://beta.frikanalen.no/stream/multiviewer.webm" />
                //<this.ATEM/>
    render = () => {
        return (
            <Layout>
            <div className="playoutControl">
                <div className="header">playout-styring</div>
                <Realtime />
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

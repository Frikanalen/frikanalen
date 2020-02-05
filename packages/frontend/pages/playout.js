import Layout from '../components/Layout';
import * as env from '../components/constants';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';

class Playout extends Component {
    constructor (props) {
        super(props)
        fetch(
            'https://beta.frikanalen.no/playout/atem/program'
        ).then(
            res=>res.json()
        ).then(json => {
            this.setState({
                program: json.inputIndex
            })
            console.log('program: ' + this.state.program)
            this.txbutton = this.txbutton.bind(this)
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
            return { 
                program: json.inputIndex
            }
        }).
        catch(e => {
            console.log(e)
        })
    }

    txbutton = (inputIndex, inputName) => {
        console.log(inputIndex)
        console.log(this.state)
        return(
            <span>
            <button className={this.props.program == inputIndex ? "active": null} onClick={() => this.set_input(inputIndex)}>{inputName}</button>
            <style jsx>{`
            button {
                margin: 3px;
                background: #F25252;
                color: white;
                font-size: 18pt;
                font-weight: bold;
                border: 2px solid black;
            }
            `}</style>
            </span>
            )
    }
    ATEM = () => {
        return (
            <div>
            { this.txbutton(2, "tx1") }
            { this.txbutton(3, "tx2") }
            { this.txbutton(1, "tx3") }
            { this.txbutton(1000, "color bars") }
            </div>
        );
    }

    render = () => {
        return (
            <Layout>
            <div className="playoutControl">
                <div className="header">playout-styring</div>
                <video ref={this.video} controls onClick={this.pause_video}
                    src="https://beta.frikanalen.no/frikanalen.webm"></video>
                <this.ATEM />
            </div>
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

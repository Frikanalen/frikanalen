import Layout from '../components/Layout';
import * as env from '../components/constants';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';

class Playout extends Component {
    constructor (props) {
        super(props)
        this.ATEM = this.ATEM.bind(this)
        this.render = this.render.bind(this)
        fetch(
            'https://beta.frikanalen.no/playout/atem/program'
        ).then(
            res=>res.json()
        ).then(json => {
            return { 
                        program: json.inputIndex
                }
        })
    }

    ATEM = (ctx) => {
        console.log(ctx)
        return <pre>{this.state.ATEMState}</pre>
    }

    render = () => {
        return (
            <Layout>
            <div className="playoutControl">
                <div className="header">playout-styring</div>
                <video ref={this.video} controls onClick={this.pause_video}
                    src="http://icecast.frikanalen.no/frikanalen.webm"></video>
                <this.ATEM s={this.state}/>
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

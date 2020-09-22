import configs from "../components/configs";
import Layout from "../components/Layout";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import React, { Component } from "react";
import Realtime from "../components/WebRTC.js";

class ATEMControl {
  constructor(atemURL) {
    this.atemURL = atemURL;
    this.program = null;
  }

  async connect(URL) {
    try {
      var data = await fetch(this.atemURL);
      var json = await data.json();
      this.program = json.inputIndex;
    } catch (e) {
      console.log(e);
    }
  }

  async setProgram(inputIndex) {
    try {
      var data = await fetch(this.atemURL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputIndex: inputIndex }),
      });
      var json = await data.json();
      this.program = json.inputIndex;
    } catch (e) {
      console.log(e);
    }
  }
}

class ATEMPanel extends Component {
  constructor(props) {
    super(props);
    this.ATEM = new ATEMControl(configs.atem);
    this.state = { program: null };
    this.inputs = [
      { index: 2, name: "tx1" },
      { index: 3, name: "tx2" },
      { index: 1, name: "tx3" },
      { index: 4, name: "rx1" },
      { index: 3010, name: "still 1" },
      { index: 1000, name: "color bars" },
    ];
  }

  async componentDidMount() {
    await this.ATEM.connect();
    this.setState({ program: this.ATEM.program });
  }

  InputButton = (input) => {
    return (
      <span>
        <button
          className={input.index == this.state.program ? "active" : ""}
          onClick={() =>
            this.ATEM.setProgram(input.index).then(
              this.setState({ program: this.ATEM.program })
            )
          }
        >
          {input.name}
        </button>
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
            background: #f25252;
          }
          @media screen and (max-width: 1024px) {
            button {
              font-size: 12pt;
            }
          }
        `}</style>
      </span>
    );
  };
  render() {
    return (
      <div id="ATEM">
        <label>Programutgang til OBE (NEP):</label>
        <div>{this.inputs.map((input) => this.InputButton(input))}</div>
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
          #ATEM > label {
            margin-left: 5px;
            font-size: 18pt;
            display: inline-block;
            vertical-align: middle;
          }
          @media screen and (max-width: 1024px) {
            #ATEM > label {
              font-size: 12pt;
            }
          }
        `}</style>
      </div>
    );
  }
}

class Playout extends Component {
  render = () => {
    return (
      <Layout>
        <div className="playoutControl">
          <div className="header">playout-styring</div>
          <Realtime />
          <ATEMPanel />
        </div>
        <style jsx global>{`
          .playoutControl > div {
            padding: 0;
          }
        `}</style>
        <style jsx>{`
          .playoutControl > .header {
            font-family: "Roboto", sans-serif;
            text-align: center;
            font-weight: bold;
            color: #f25252;
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

const { Atem } = require('atem-connection')
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch')
const cookieParser = require("cookie-parser");

const ATEM_HOST = process.env.ATEM_HOST || undefined;
const LISTEN_PORT = process.env.PORT || undefined;
const FK_API_URL = process.env.FK_API_URL || 'https://frikanalen.no/api'

class AtemControl {
    constructor() {
        if(LISTEN_PORT === undefined) {
            throw new Error("PORT environment variable must be set!");
        }

        this.myAtem = new Atem()
        this.app = express();
        this.app.use(bodyParser.json());
    }

    listen() {
        if(ATEM_HOST === undefined)
            throw new Error("ATEM_HOST environment variable must be set!");
        this.myAtem.on('info', console.log)
        this.myAtem.on('error', console.error)


        this.myAtem.connect(ATEM_HOST);

        this.myAtem.on('connected', () => {
            this.myAtem.setAudioMixerInputProps(1, {mixOption: 2});
            this.myAtem.setAudioMixerInputProps(2, {mixOption: 2});
            this.myAtem.setAudioMixerInputProps(3, {mixOption: 2});
            this.myAtem.setAudioMixerInputProps(4, {mixOption: 2}).then(res => console.log(res))
            this.myAtem.setAudioMixerInputGain(4, 1.0).then(res => console.log(res));
            //this.myAtem.setMultiViewerSource({source:2, windowIndex: 2}, 0).then(res => console.log(res))
            //this.myAtem.setMultiViewerSource({source:3, windowIndex: 3}, 0).then(res => console.log(res))
            //this.myAtem.setInputSettings({shortName:"RX", longName:"RX"}, 4).then(res => console.log(res))
            this.myAtem.setMultiViewerSource({source:1, windowIndex: 1}, 0).then(res => console.log(res))
            this.myAtem.setMultiViewerSource({source:3, windowIndex: 3}, 0).then(res => console.log(res))
            this.myAtem.setMultiViewerSource({source:4, windowIndex: 4}, 0).then(res => console.log(res))
            //this.myAtem.changeProgramInput(3)
            //this.myAtem.setInputSettings({shortName:"TX1", longName:"TX1"}, 2).then(res => console.log(res))
            //this.myAtem.setInputSettings({shortName:"TX2", longName:"TX2"}, 3).then(res => console.log(res))
            //this.myAtem.setInputSettings({shortName:"TX3", longName:"TX3"}, 1).then(res => console.log(res))

            this.app.listen(LISTEN_PORT, () => {
              console.log(`Server listening on port ${LISTEN_PORT}...`);
            });
        })

        this.myAtem.on('stateChanged', (state, pathToChange) => {
//            console.log(state.settings.multiViewers[0].windows);
          //console.log(state); // catch the ATEM state.
        });

        this.app.use(cookieParser());
        this.app.get('/program', (req, res) => {
            const programInput =this.myAtem.state.video.ME["0"]["programInput"];
            res.send({inputIndex: programInput});
        });
        this.app.get('/ping', (req, res) => {
            res.send('pong');
        }
        );
        this.app.post('/program', (req, res) => {
            let token = req.headers['x-access-token'] || req.headers['authorization'] || req.cookies.token
            if(typeof token === 'undefined')
                res.status(401).send('eek').end()

            // Express headers are auto converted to lowercase
            if (token.startsWith('Token ')) {
                // Remove token from string
                token = token.slice(6, token.length);
            }

            var input_index = parseInt(req.body.inputIndex);
            console.log(req.body);
            this.check_if_staff(token).then((staff) => {
                if(!staff) {
                    res.status(403).send('eek').end()
                } else {
                    this.myAtem.changeProgramInput(input_index).then(success => {
                        const programInput =this.myAtem.state.video.ME["0"]["programInput"];
                        res.send({inputIndex: programInput});
                    })
                }
            }
            )
        });
    }

    async check_if_staff(token) {
        let res = await fetch(FK_API_URL + '/user', 
            {
                headers: { 'Authorization': 'Token ' + token, }
            }
        )
        if(res.status == 200) {
            let json = await res.json()
            return json.is_staff ? true : false
        } else {
            return false;
        }
    }

}


atem = new AtemControl();
atem.listen()

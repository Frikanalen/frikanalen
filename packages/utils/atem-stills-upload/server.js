const { Atem } = require('atem-connection')
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch')
const cookieParser = require("cookie-parser");

const ATEM_HOST = process.env.ATEM_HOST || undefined;
const LISTEN_PORT = process.env.PORT || undefined;


class AtemControl {
    constructor() {
        if(LISTEN_PORT === undefined) {
            throw new Error("PORT environment variable must be set!");
        }

        this.myAtem = new Atem()
        this.app = express();
        this.app.use(bodyParser.json());
    }

    async initialize() {
    }

    listen() {
        if(ATEM_HOST === undefined)
            throw new Error("ATEM_HOST environment variable must be set!");
        this.myAtem.on('info', console.log)
        this.myAtem.on('error', console.error)

        this.myAtem.connect(ATEM_HOST);

        this.myAtem.on('connected', () => {
            this.initialize();

            this.app.listen(LISTEN_PORT, () => {
              console.log(`Server listening on port ${LISTEN_PORT}...`);
            });
        })

        this.myAtem.on('stateChanged', (state, pathToChange) => {
        });

        this.app.use(cookieParser());

        this.app.get('/ping', (req, res) => { res.send('pong'); });

        // TODO: Should be a GET method
        this.app.post('/preview', (req, res) => {
            fetch('https://stills-generator.frikanalen.no/getPoster.png',
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'post',
                    body: JSON.stringify(req.body),
                })
                .then(data => data.buffer())
                .then(data => res.type('image/png').send(data))
                })
        })

        this.app.post('/upload', (req, res) => {
            let token = req.headers['x-access-token'] || req.headers['authorization'] || req.cookies.token
            if(typeof token === 'undefined')
                res.status(401).send('eek').end()

            // Express headers are auto converted to lowercase
            if (token.startsWith('Token ')) {
                // Remove token from string
                token = token.slice(6, token.length);
            }

            console.log(req.body);
            this.check_if_staff(token).then((staff) => {
                if(!staff) {
                    res.status(403).send('eek').end()
                } else {
                    fetch('https://stills-generator.frikanalen.no/getPoster.rgba',
                        {
                            method: 'post',
                            body: JSON.stringify(req.body),
                            headers: {'Content-Type': 'application/json'},
                        })
                    .then(res => res.buffer())
                    .then(frameBuffer => {
                        this.myAtem.uploadStill(0, frameBuffer, 'test', 'test')
                        .then(() => res.send({result: 'success'}));
                    })
                }
            }
            )
        });
    }

    async check_if_staff(token) {
        let res = await fetch('https://frikanalen.no/api/user', 
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

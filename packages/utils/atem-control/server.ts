// vim: set ft=typescript:
// Forgive me. This was my first Node project ever. It's starting to get back into shape.
// Tidying-up PRs _very_ welcome.

import {Atem} from "atem-connection";

import express, { Request as expressRequest, Response as expressResponse } from "express";
const bodyParser = require('body-parser');
import fetch from "node-fetch";
const ATEM_HOST = process.env.ATEM_HOST || undefined;
const LISTEN_PORT = process.env.PORT || undefined;
const FK_API_URL = process.env.FK_API_URL || 'https://frikanalen.no/api'

async function check_if_staff(authHeader: string | undefined) {
    if (authHeader == 'undefined')
        return false

    // Express headers are auto converted to lowercase
    if (authHeader && authHeader.startsWith('Token ')) {
        // Remove token from string
        authHeader = authHeader.slice(6, authHeader.length);
    } else {
        console.error("Refusing to authenticate without authorization header");
        return false;
    }

    const res = await fetch(FK_API_URL + '/user',
        {
            headers: {'Authorization': 'Token ' + authHeader,}
        }
    )
    if (res.ok) {
        let json = await res.json()
        return !!json.is_staff
    } else {
        console.error("User is not staff");
        return false;
    }
}

class AtemControl {
    myAtem: Atem;
    app = express.application;

    constructor() {
        if (LISTEN_PORT === undefined) {
            throw new Error("PORT environment variable must be set!");
        }

        this.myAtem = new Atem()
        this.app = express();
        this.app.use(bodyParser.json());
    }

    async run() {
        if (ATEM_HOST === undefined)
            throw new Error("ATEM_HOST environment variable must be set!");
        this.myAtem.on('error', console.error)

        this.myAtem.on('connected', async () => {
            await this.myAtem.setAudioMixerInputProps(1, {mixOption: 2});
            await this.myAtem.setAudioMixerInputProps(2, {mixOption: 2});
            await this.myAtem.setAudioMixerInputProps(3, {mixOption: 2});
            await this.myAtem.setAudioMixerInputProps(4, {mixOption: 2});

            this.app.listen(LISTEN_PORT, () => {
                console.log(`Server lisdtening on port ${LISTEN_PORT}...`);
            });
        })


        this.app.get('/program', (req: expressRequest, res: expressResponse) => {
            const programInput = this.myAtem.state.video.ME["0"]["programInput"];
            res.send({inputIndex: programInput});
        });
        this.app.get('/ping', (req, res) => {
                res.send('pong');
            }
        );


        this.app.post('/program', (req: expressRequest, res: expressResponse) => {
            const input_index = parseInt(req.body.inputIndex);
            console.log(req.body);
            check_if_staff(req.headers.authorization).then((staff) => {
                    if (!staff) {
                        res.status(403).send('eek').end()
                    } else {
                        this.myAtem.changeProgramInput(input_index).then(() => {
                            const programInput = this.myAtem.state.video.ME["0"]["programInput"];
                            res.send({inputIndex: programInput});
                        })
                    }
                }
            )
        });
        console.error("asdfasdf");

        // FIXME: This should not be running through the atem control server at all!
        // TODO: move from buffer() to streams
        this.app.get('/poster/preview', async (req: expressRequest, res: expressResponse) => {
            const text = req.query.text;
            const heading = req.query.heading;
            console.error("Generating poster: [", text, "] heading: [", heading, "].")
            const pngPosterRes = await fetch('http://stills-generator/getPoster.png',
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'post',
                    body: JSON.stringify({text: text, heading: heading}),
                })
            if (!pngPosterRes.ok) {
                res.status(500).send(`unexpected response from renderer ${pngPosterRes.statusText}`).end();
                return;
            }
            const pixMap = await pngPosterRes.arrayBuffer()
            res.type('image/png').send(new Buffer(pixMap))
        });

        this.app.post('/poster/upload', async (req: expressRequest, res: expressResponse) => {
            const staff = await check_if_staff(req.headers.authorization);
            if (!staff) {
                res.status(403).send('User not authorized').end()
                return
            }

            const posterRequest = await fetch('http://stills-generator/getPoster.rgba',
                {
                    method: 'post',
                    body: JSON.stringify(req.body),
                    headers: {'Content-Type': 'application/json'},
                })
            if (!posterRequest.ok) throw new Error(`unexpected response from renderer ${posterRequest.statusText}`);
            try {
                const pixMap = await posterRequest.arrayBuffer()
                await this.myAtem.uploadStill(0, new Buffer(pixMap), 'test', 'test');
                res.send({result: 'success'});
            } catch (e) {
                console.log(e);
                throw new Error(`exception: ${e}`);
            }
        });

        await this.myAtem.connect(ATEM_HOST);
    }
}

let atem = new AtemControl();
atem.run();

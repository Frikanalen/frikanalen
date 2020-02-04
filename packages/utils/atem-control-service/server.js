const { Atem } = require('atem-connection')
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch')

class AtemControl {
    constructor() {
        this.myAtem = new Atem()
        this.app = express();
        this.app.use(bodyParser.json());
    }

    listen() {
        this.myAtem.on('info', console.log)
        this.myAtem.on('error', console.error)

        this.myAtem.connect('10.3.2.1')

        this.myAtem.on('connected', () => {
            // Listen to the App Engine-specified port, or 8082 otherwise
            this.myAtem.setAudioMixerInputProps(1, {mixOption: 2});
            this.myAtem.setAudioMixerInputProps(2, {mixOption: 2});
            this.myAtem.setAudioMixerInputProps(3, {mixOption: 2});
            const PORT = process.env.PORT || 8082;
            this.app.listen(PORT, () => {
              console.log(`Server listening on port ${PORT}...`);
            });
        //    console.log(this.myAtem.state)
        })

        this.myAtem.on('stateChanged', (state, pathToChange) => {
        //  console.log(state); // catch the ATEM state.
        });
        this.app.post('/program', (req, res) => {
            let token = req.headers['x-access-token'] || req.headers['authorization']; 
            // Express headers are auto converted to lowercase
            if (token.startsWith('Token ')) {
                // Remove token from string
                token = token.slice(6, token.length);
            }

            var input_index = parseInt(req.body.input_index);
            this.check_if_staff(token).then((staff) => {
                if(!staff) {
                    res.status(403).send('eek').end()
                } else {
                    this.myAtem.changeProgramInput(input_index).then(success => {
                        res.send({input_index: input_index})
                    })
                }
            }
            )
        });
    }

    async check_if_staff(token) {
        let res = await fetch('https://dev.frikanalen.no/api/user', 
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

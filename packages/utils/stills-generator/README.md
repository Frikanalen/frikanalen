# stills-generator

This microservice generates a poster with text, which is used to generate
stills during eg. live transmissions, generally uploaded to the ATEM production
switcher.

## Usage


`GET /getPoster.png?text=foo&heading=bar`
`POST /getPoster.png <- {"text": "foo", "heading": "bar"}`

Returns a 1280x720 PNG file.

## Todo

- Configurable graphical profiles

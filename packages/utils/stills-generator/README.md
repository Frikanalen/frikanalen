# stills-generator
![Build stills generator microservice](https://github.com/frikanalen/Frikanalen/workflows/Build%20stills%20generator%20microservice/badge.svg)

This microservice generates a poster with text, which is used to generate
stills during eg. live transmissions, generally uploaded to the ATEM production
switcher.

## Usage


`GET /getPoster.png?text=foo&heading=bar`
`POST /getPoster.png <- {"text": "foo", "heading": "bar"}`

Returns a 1280x720 PNG file.

## Todo

- Configurable graphical profiles

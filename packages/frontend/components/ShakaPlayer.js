import React, { Component } from 'react';

var shaka = require('shaka-player/dist/shaka-player.ui.js');

export default class DASHPlayer extends Component {
    constructor(props) {
        super(props);
        this.videoContainer = React.createRef();
        this.video = React.createRef();
        this.initPlayer = this.initPlayer.bind(this);
    };

    onErrorEvent (event) {
        // Extract the shaka.util.Error object from the event.
        onError(event.detail);
    }

    initApp() {
        console.log('hiiii')
        // Install built-in polyfills to patch browser incompatibilities.
        shaka.polyfill.installAll();

        // Check to see if the browser supports the basic APIs Shaka needs.
        if (shaka.Player.isBrowserSupported()) {
            // Everything looks good!
            this.initPlayer();
        } else {
            // This browser does not have the minimum set of APIs we need.
            console.error('Browser not supported!');
        }
    }

    initPlayer() {
        // Create a Player instance.
        this.player = new shaka.Player(this.video.current);
        this.shaka = new shaka.cast.CastProxy(this.video.current, this.player, '892FD57F')
        this.player = this.shaka.getPlayer()
        this.ui = new shaka.ui.Overlay(this.player, this.videoContainer.current, this.video.current);

        // Attach this.player.to the window to make it easy to access in the JS console.
        window.player = this.player;

        // Listen for error events.
        this.player.addEventListener('error', this.onErrorEvent);

        //https://beta.frikanalen.no/stream/frikanalen/frikanalen.mpd';
        // Try to load a manifest.
        // This is an asynchronous process.
        this.player.load(this.props.src).then(function() {
            // This runs if the asynchronous load is successful.
            console.log('The video has now been loaded!');
        }).catch(this.onError);  // onError is executed if the asynchronous load fails.

    }

    componentDidMount() {
        this.initApp();
        //window.document.addEventListener('shaka-ui-loaded', () => {this.initApp()});
    }

    render() {
        return ( 
            <div className={"aspect-enforced-container"} ref={this.videoContainer}>
            <video ref={this.video} />
            <style jsx>{`
                /* I'm not sure if this is the right way to do this */
                .aspect-enforced-container {
                    width: 100%;
                    padding-top: 56.25%;
                    height: 0px;
                    position: relative;
                }
                video {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            `}</style>
            </div>
        );
    }
}

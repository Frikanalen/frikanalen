import ShakaPlayerReact from 'shaka-player-react';
import React from "react";

// This file only exists because shaka-player does not have TS typings yet. Irritating kludge.

export default function ShakaPlayer({src}) {
    return (<ShakaPlayerReact src={src} />)
}
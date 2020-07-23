import React from 'react';
import dynamic from 'next/dynamic';

const ShakaPlayer = dynamic(
  () => import('shaka-player-react'), 
  { ssr: false }
);

export default function DASHPlayer(props) {
  return (
    <div>
      <ShakaPlayer src={props.manifestUri}
      />
    </div>
  );
}

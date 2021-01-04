import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react";

import { VideoWidget, VideoWidgetProps } from "../components/VideoWidget";

export default {
  title: "Frikanalen/VideoWidget",
  component: VideoWidget,
  argTypes: {
    video: { control: "object" },
  },
} as Meta;

const Template: Story<VideoWidgetProps> = (args) => (
  <div className="videoWidgetTemplate">
    <VideoWidget {...args} />
    <style jsx>{`
      .videoWidgetTemplate {
        border: 1px solid black;
        width: 1024px;
        height: 576px;
      }
    `}</style>
  </div>
);

export const VOD = Template.bind({});
VOD.args = {
  video: {
    id: 626503,
    name: "Test fra iPhone",
    header: "Denne kan gjerne slettes",
    description: null,
    files: {
      theora: "https://upload.frikanalen.no/media/626503/theora/trim.0F62C9AE-673F-4E2A-994F-A08975669B10.ogv",
      broadcast: "https://upload.frikanalen.no/media/626503/broadcast/trim.0F62C9AE-673F-4E2A-994F-A08975669B10.dv",
      largeThumb: "https://upload.frikanalen.no/media/626503/large_thumb/trim.0F62C9AE-673F-4E2A-994F-A08975669B10.jpg",
      original: "https://upload.frikanalen.no/media/626503/original/trim.0F62C9AE-673F-4E2A-994F-A08975669B10.MOV",
    },
    creator: "erikvol@gmail.com",
    organization: {
      id: 3,
      name: "Frikanalen",
      homepage: "https://frikanalen.no",
      description:
        "Frikanalen er sivilsamfunnets videoplatform.\r\n\r\nVi ønsker i samarbeid med våre medlemsorganisasjoner utvikle en videoplattform uten forhåndssensur, tilrettelagt for behovene til norsk demokrati, organisasjonsliv og frivillighet.",
      postalAddress: "c/o Advokat Tellesbø\r\nÅsvegen 115\r\n2740 ROA",
      streetAddress: "Åsvegen 115\r\n2740 ROA",
      editorId: 2086,
      editorName: "Tore Sinding Bekkedal",
      editorEmail: "toresbe@protonmail.com",
      editorMsisdn: "+47 918 59 508",
      fkmember: true,
    },
    duration: "00:00:03.335001",
    categories: ["Samfunn"],
    framerate: 25000,
    properImport: true,
    hasTonoRecords: false,
    publishOnWeb: true,
    isFiller: false,
    refUrl: "",
    createdTime: "2020-09-24T18:27:31.218942Z",
    updatedTime: "2020-09-24T18:29:22.265773Z",
    uploadedTime: "2020-09-24T18:29:19.354196Z",
    ogvUrl: "https://upload.frikanalen.no/media/626503/theora/trim.0F62C9AE-673F-4E2A-994F-A08975669B10.ogv",
    largeThumbnailUrl:
      "https://upload.frikanalen.no/media/626503/large_thumb/trim.0F62C9AE-673F-4E2A-994F-A08975669B10.jpg",
  },
};

export const VODLoading = Template.bind({});
VODLoading.args = {};

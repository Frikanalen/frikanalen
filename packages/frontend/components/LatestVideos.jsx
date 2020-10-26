import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "./configs";

const latestVideo = (video) => {
  return (
    <p>
      <a href={`/v/${video.id}`}>{video.name}</a>
    </p>
  );
};

export default class LatestVideos extends Component {
  constructor(props) {
    super(props);
    const { orgID } = props;
    this.state = {
      orgID,
      videos: [],
    };
  }

  async componentDidMount() {
    const { orgID } = this.state;
    if (typeof orgID !== "undefined") {
      const res = await fetch(`${configs.api}videos/?page_size=5&organization=${orgID}`);
      const data = await res.json();
      this.setState({ videos: data.results });
    }
  }

  render() {
    const { videos } = this.state;
      if (typeof videos === "undefined") {
      return null;
      }
    return <p>{videos.map((v) => latestVideo(v))}</p>;
  }
}

LatestVideos.propTypes = {
  orgID: PropTypes.number.isRequired,
};

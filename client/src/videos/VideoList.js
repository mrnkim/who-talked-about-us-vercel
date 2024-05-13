import { React, Suspense } from "react";
import { Col } from "react-bootstrap";
import ReactPlayer from "react-player";
import "./VideoList.css";
import LoadingSpinner from "../common/LoadingSpinner";
import { ErrorBoundary } from "react-error-boundary";
import keys from "../apiHooks/keys";
import ErrorFallback from "../common/ErrorFallback";
import { useGetVideo } from "../apiHooks/apiHooks";

/** Shows list of the video in an index
 *
 *  VideoComponents -> VideoList
 *
 */

function VideoList({ videos, refetchVideos, currIndex }) {
  const videoIds = videos.map((video) => video._id);

  const videosInfo = [];
  videoIds.map((videoId) => {
    const videoInfo = useGetVideo(currIndex, videoId);
    videosInfo.push(videoInfo.data);
  });

  const numVideos = videosInfo.length;

  return videosInfo.map((videoInfo, index) => (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => refetchVideos()}
      resetKeys={[keys.VIDEOS, index]}
      key={videoInfo._id + "-" + index}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Col
          sm={12}
          md={numVideos > 1 ? 6 : 12}
          lg={numVideos > 1 ? 4 : 12}
          xl={numVideos > 1 ? 3 : 12}
          className="mb-5 mt-3"
        >
          {" "}
          <ReactPlayer
            url={videoInfo.source.url}
            controls
            width="100%"
            height="250px"
          />
          <div className="channelAndVideoName">
            <div className="channelPillSmall">{videoInfo.source.author}</div>
            <div className="filename-text">
              {videoInfo.metadata.filename.replace(".mp4", "")}
            </div>
          </div>
        </Col>
      </Suspense>
    </ErrorBoundary>
  ));
}

export default VideoList;

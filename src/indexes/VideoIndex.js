import { useState, useEffect, Suspense } from "react";
import SearchForm from "../search/SearchForm";
import UploadYoutubeVideo from "../videos/UploadYouTubeVideo";
import backIcon from "../svg/Back.svg";
import infoIcon from "../svg/Info.svg";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../common/ErrorFallback";
import { Container, Row } from "react-bootstrap";
import SearchResultList from "../search/SearchResultList";
import VideoList from "../videos/VideoList";
import "./VideoIndex.css";
import { PageNav } from "../common/PageNav";
import { useDeleteIndex, useGetVideos, useSearchVideo } from "../api/apiHooks";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { keys } from "../api/keys";
import { IndexBar } from "./IndexBar";

const PAGE_LIMIT = 12;

/**
 * Show video list and videos, search form and search result list
 *
 * App -> VideoIndex -> { SearchForm, SearchResultList, UploadYoutubeVideo, VideoList}
 */
function VideoIndex({ index }) {
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const {
    data: videosData,
    refetch,
    isPreviousData,
  } = useGetVideos(index._id, page, PAGE_LIMIT);

  const videos = videosData?.data;

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [keys.VIDEOS] });
  }, [videos]);

  const currIndex = index._id;

  const searchVideoMutation = useSearchVideo();
  const searchResults = searchVideoMutation.data?.data;

  const deleteIndexMutation = useDeleteIndex();

  const [taskVideos, setTaskVideos] = useState(null);
  const [showVideos, setShowVideos] = useState(false);

  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [isIndexSelected, setIsIndexSelected] = useState(false);

  /** State variables for delete confirmation modal */
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const showDeleteConfirmationMessage = () => {
    setShowDeleteConfirmation(true);
  };

  const hideDeleteConfirmationMessage = () => {
    setShowDeleteConfirmation(false);
  };

  /** Deletes an index */
  async function deleteIndex() {
    await deleteIndexMutation.mutateAsync(currIndex);
    hideDeleteConfirmationMessage();
  }

  /** Toggle whether to show or not show the components  */
  function handleClick() {
    setIsIndexSelected(!isIndexSelected);
    setShowVideos(!showVideos);
  }

  /** Reset search and show videos */
  function reset() {
    setShowVideos(true);
    setSearchPerformed(false);
  }

  const uniqueAuthors = new Set();
  videos?.forEach((vid) => {
    uniqueAuthors.add(vid.metadata.author);
  });

  const searchResultsContent =
    searchVideoMutation.isSuccess && searchResults.length === 0 ? (
      <div className="title">No results. Let's try with other queries!</div>
    ) : (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          <SearchResultList searchResults={searchResults} videos={videos} />
        </Suspense>
      </ErrorBoundary>
    );

  return (
    <Container className="m-auto defaultContainer">
      <IndexBar
        handleClick={handleClick}
        showDeleteButton={showDeleteButton}
        setShowDeleteButton={setShowDeleteButton}
        isIndexSelected={isIndexSelected}
        index={index}
        videosData={videosData}
        showDeleteConfirmationMessage={showDeleteConfirmationMessage}
        hideDeleteConfirmationMessage={hideDeleteConfirmationMessage}
        showDeleteConfirmation={showDeleteConfirmation}
        deleteIndex={deleteIndex}
      />
      {showVideos && videos?.length === 0 && (
        <div>
          <div className="doNotLeaveMessageWrapper">
            <img src={infoIcon} alt="infoIcon" className="icon"></img>
            <div className="doNotLeaveMessage">
              There are no videos. Start indexing ones!
            </div>
          </div>

          <div className="videoUploadForm">
            <div className="display-6 m-4">Upload New Videos</div>
            <UploadYoutubeVideo
              currIndex={currIndex}
              taskVideos={taskVideos}
              setTaskVideos={setTaskVideos}
            />
          </div>
        </div>
      )}

      {showVideos && videos?.length > 0 && (
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => refetch()}
          resetKeys={[keys.VIDEOS]}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <div className="videoUploadForm">
              <div className="display-6 m-4">Upload New Videos</div>
              <UploadYoutubeVideo
                currIndex={currIndex}
                taskVideos={taskVideos}
                setTaskVideos={setTaskVideos}
              />
            </div>
            {/* Video Search Form */}
            {showVideos && !searchPerformed && videos.length > 0 && (
              <div>
                <div className="videoSearchForm">
                  <div className="title">Search Videos</div>
                  <div className="m-auto p-3 searchFormContainer">
                    <SearchForm
                      index={currIndex}
                      searchVideoMutation={searchVideoMutation}
                      setSearchPerformed={setSearchPerformed}
                      setSearchQuery={setSearchQuery}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
                <div className="channelPills">
                  <div className="subtitle">All Channels in Index </div>
                  {[...uniqueAuthors].map((author) => (
                    <div key={author + "-" + index} className="channelPill">
                      {author}
                    </div>
                  ))}
                </div>
                <Container fluid className="mb-5">
                  <Row>
                    {videos && (
                      <VideoList index_id={currIndex} videos={videos} />
                    )}
                    <Container
                      fluid
                      className="my-5 d-flex justify-content-center"
                    >
                      <PageNav
                        page={page}
                        setPage={setPage}
                        data={videosData}
                        inPreviousData={isPreviousData}
                      />
                    </Container>
                  </Row>
                </Container>
              </div>
            )}

            {/* Video Search Results */}
            {searchPerformed && (
              <div>
                {!searchVideoMutation.isPending && searchResults.length > 0 && (
                  <div className="searchResultTitle">
                    Search Results for "{searchQuery}"
                  </div>
                )}
                <div className="videoSearchForm">
                  <div className="m-auto p-3 searchFormContainer">
                    <SearchForm
                      index={currIndex}
                      searchVideoMutation={searchVideoMutation}
                      setSearchPerformed={setSearchPerformed}
                      setSearchQuery={setSearchQuery}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
                <Container fluid className="m-3">
                  <Row>{searchResultsContent}</Row>
                </Container>
                <div className="resetButtonWrapper">
                  <button className="resetButton" onClick={reset}>
                    {backIcon && (
                      <img src={backIcon} alt="Icon" className="icon" />
                    )}
                    &nbsp;Back to All Videos
                  </button>
                </div>
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      )}
    </Container>
  );
}

export default VideoIndex;

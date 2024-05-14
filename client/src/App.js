import { Suspense } from "react";
import Container from "react-bootstrap/Container";
import VideoIndex from "./indexes/VideoIndex";
import LoadingSpinner from "./common/LoadingSpinner";
import "./App.css";

/** Who Talked About Us App
 *
 * - indexId: id of an index to work with
 *
 * App -> { ExistingIndexForm, IndexForm, VideoIndex }
 */

function App() {
  const INDEX_ID = process.env.REACT_APP_INDEX_ID;

  return (
    <div className="App">
      <Container className="p-3 mt-5">
        <h1 className="display-5 p-2">Who Talked About Us?</h1>
        <h4>Find the right influencers (organic brand fans) to reach out </h4>
      </Container>
      <Container className="m-auto p-3">
        <div className="mb-3">
          <Suspense fallback={<LoadingSpinner />}>
            <VideoIndex indexId={INDEX_ID} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}

export default App;

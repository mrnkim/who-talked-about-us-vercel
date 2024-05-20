import "./IndexBar.css";

/** Index bar that shows index name and number of total videos
 *
 *  VideoComponents -> IndexBar
 *
 */

export function IndexBar({ index }) {
  return (
    <>
      {
        <div className="default-index">
          <div className="indexBar">
            <div>
              <i className="bi bi-folder"></i>
              <span className="indexName">{index.index_name}</span>
            </div>
          </div>
        </div>
      }
    </>
  );
}

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

/** API Class
 *
 * Static class tying together methods used to get/send to the API.
 *
 */
class TwelveLabsApi {
  /** Get indexes of a user */
  static async getIndexes() {
    const config = {
      method: "GET",
      url: `${API_URL}/indexes`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    };
    try {
      const response = await axios.request(config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  /** Creates an index */
  static async createIndex(indexName) {
    const config = {
      method: "POST",
      url: `${API_URL}/indexes`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      data: {
        engines: [{ engine_name: "marengo2.5" }],
        index_options: ["visual", "conversation", "text_in_video", "logo"],
        index_name: indexName,
      },
    };
    try {
      const response = await axios.request(config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  /** Deletes an index */
  static async deleteIndex(indexId) {
    const config = {
      method: "DELETE",
      url: `${API_URL}/indexes/${indexId}`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    };
    try {
      const response = await axios.request(config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  /** Get all videos of an index */
  static async getVideos(indexId) {
    const config = {
      method: "GET",
      params: { page_limit: "50" },
      url: `${API_URL}/indexes/${indexId}/videos`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    };
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  /** Search videos with a given query */
  static async searchVideo(indexId, query) {
    const config = {
      method: "POST",
      url: `${API_URL}/search`,
      headers: {
        "x-api-key": API_KEY,
        accept: "application/json",
      },
      data: {
        index_id: `${indexId}`,
        search_options: ["visual", "conversation", "text_in_video", "logo"],
        query: `${query}`,
      },
    };
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  /** Updates a video */
  static async updateVideo(indexId, videoId, data) {
    const config = {
      method: "PUT",
      url: `${API_URL}/indexes/${indexId}/videos/${videoId}`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      data: data,
    };
    try {
      const response = await axios.request(config);
      return response.status;
    } catch (error) {
      console.error(error);
    }
  }

  /** Check the status of a specific indexing task */
  static async getTask(taskId) {
    const config = {
      method: "GET",
      url: `${API_URL}/tasks/${taskId}`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    };
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default TwelveLabsApi;

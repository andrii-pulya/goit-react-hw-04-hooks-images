import axios from "axios";

export default class PixabayServiseApi {
  constructor() {
    this.pageNumber = 1;
  }

  async pictureFind(pictureName) {
    axios.defaults.baseURL = "https://pixabay.com/api/";
    const myKey = "21807321-d1b9b9077da7f78b4c19cddb8";
    try {
      const request = await axios.get(
        `?key=${myKey}&q=${pictureName}&page=${this.pageNumber}&per_page=12&image_type=photo&orientation=horizontal`
      );
      return request.data;
    } catch (error) {
      return error;
    }
  }

  incrementPage() {
    this.pageNumber += 1;
  }

  resetPage() {
    this.pageNumber = 1;
  }
}

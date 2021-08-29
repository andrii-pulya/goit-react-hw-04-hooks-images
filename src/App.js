import "./App.css";

import React, { Component } from "react";
import toast, { Toaster } from "react-hot-toast";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import Serchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery.jsx";
import ImageGalleryItem from "./components/ImageGalleryItem.jsx";
import Modal from "./components/Modal.jsx";
import Button from "./components/Button.jsx";
import Loader from "react-loader-spinner";
import PixabayServiseApi from "./services/apiService";

const PixabayService = new PixabayServiseApi();

export default class App extends Component {
  state = {
    pictureName: null,
    pictures: [],
    reqStatus: "idle", //idle, pending, resolved, rejected
    showModal: false,
    largeImageUrl: null,
    imageTags: null,
  };

  componentDidUpdate(_, prevState) {
    const { pictureName } = this.state;
    if (pictureName === "") {
      toast.error("Please, enter the key word!");
    } else {
      if (prevState.pictureName !== pictureName) {
        this.setState({ pictures: [], reqStatus: "pending" });
        PixabayService.resetPage();
        PixabayService.pictureFind(pictureName)
          .then((response) => {
            if (response.hits.length === 0) {
              this.setState({ reqStatus: "rejected" });
              toast.error("We tried, but can't find any");
            } else {
              this.setState({ pictures: response.hits, reqStatus: "resolved" });
            }
          })
          .catch((error) => alert(error.message));
      }
    }
  }

  handleFormSubmit = (pictureName) => {
    this.setState({ pictureName: pictureName.trim() });
    if (pictureName.trim() === this.state.pictureName) {
      toast("Look, We already find it!", {
        style: { color: "blue", backgroundColor: "yellow" },
        icon: "🔥",
      });
    }
  };

  handleLoadMore = () => {
    this.setState({ reqStatus: "pending" });
    PixabayService.incrementPage();
    PixabayService.pictureFind(this.state.pictureName)
      .then((response) => {
        const newImages = response.hits;
        this.setState({
          pictures: [...this.state.pictures, ...newImages],
        });
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      })
      .catch((error) => alert(error.message));
    this.setState({ reqStatus: "resolved" });
  };

  toggleModal = (largeImageURL, imageTags) => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
    this.setState({ largeImageUrl: largeImageURL, imageTags });
  };

  render() {
    const { pictures, reqStatus, showModal, largeImageUrl, imageTags } =
      this.state;
    const showGallery = pictures.length > 1;
    const showLoadMoreBtn = pictures.length >= 12;
    return (
      <div>
        <Serchbar onSubmit={this.handleFormSubmit} />

        {showGallery && (
          <ImageGallery>
            <ImageGalleryItem pictures={pictures} onClick={this.toggleModal} />
          </ImageGallery>
        )}
        {reqStatus === "pending" && (
          <div className="loaderContainer">
            <Loader
              type="ThreeDots"
              color="#00BFFF"
              height={100}
              width={100}
              timeout={3000}
            />
          </div>
        )}
        {showLoadMoreBtn && <Button onClick={this.handleLoadMore} />}
        {showModal && (
          <Modal
            largeImg={largeImageUrl}
            tags={imageTags}
            onClose={this.toggleModal}
          />
        )}
        <Toaster position="top-right" />
      </div>
    );
  }
}

import './App.css'

import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Serchbar from './components/Searchbar'
import ImageGallery from './components/ImageGallery.jsx'
import ImageGalleryItem from './components/ImageGalleryItem.jsx'
import Modal from './components/Modal.jsx'
import Button from './components/Button.jsx'
import Loader from 'react-loader-spinner'
import PixabayServiseApi from './services/apiService'

const PixabayService = new PixabayServiseApi()

export default function App() {
  const [pictureName, setPictureName] = useState(null)
  const [pictures, setPictures] = useState([])
  const [reqStatus, setReqstatus] = useState('idle')
  const [showModal, setShowModal] = useState(false)
  const [largeImageUrl, setLargeImageUrl] = useState(null)
  const [imageTags, setImageTags] = useState(null)

  useEffect(() => {
    if (pictureName === null) {
      return
    }

    if (pictureName === '') {
      toast.error('Please, enter the key word!')
    } else {
      setPictures([])
      setReqstatus('pending')
      PixabayService.resetPage()
      PixabayService.pictureFind(pictureName)
        .then((response) => {
          if (response.hits.length === 0) {
            setReqstatus('rejected')
            toast.error("We tried, but can't find any")
          } else {
            setPictures(response.hits)
            setReqstatus('resolved')
          }
        })
        .catch((error) => alert(error.message))
    }
  }, [pictureName])

  function handleFormSubmit(pictureNameFind) {
    if (pictureNameFind.trim() !== '') {
      setPictureName(pictureNameFind.trim())
    } else {
      toast.error('Please, enter the key word!')
    }

    if (pictureNameFind.trim() === pictureName) {
      toast('Look, We already find it!', {
        style: { color: 'blue', backgroundColor: 'yellow' },
        icon: '🔥',
      })
    }
  }

  function handleLoadMore() {
    setReqstatus('pending')
    PixabayService.incrementPage()
    PixabayService.pictureFind(pictureName)
      .then((response) => {
        const newImages = response.hits
        setPictures([...pictures, ...newImages])
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        })
      })
      .catch((error) => alert(error.message))
    setReqstatus('resolved')
  }

  function toggleModal(largeImageURL, imageTags) {
    setShowModal(!showModal)
    setLargeImageUrl(largeImageURL)
    setImageTags(imageTags)
  }

  const showGallery = pictures.length > 1
  const showLoadMoreBtn = pictures.length >= 12

  return (
    <div>
      <Serchbar onSubmit={handleFormSubmit} />

      {showGallery && (
        <ImageGallery>
          <ImageGalleryItem pictures={pictures} onClick={toggleModal} />
        </ImageGallery>
      )}
      {reqStatus === 'pending' && (
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
      {showLoadMoreBtn && <Button onClick={handleLoadMore} />}
      {showModal && (
        <Modal
          largeImg={largeImageUrl}
          tags={imageTags}
          onClose={toggleModal}
        />
      )}
      <Toaster position="top-right" />
    </div>
  )
}

import PropTypes from 'prop-types'

export default function ImageGalleryItem({ pictures, onClick }) {
  return (
    <>
      {pictures.map((picture) => (
        <li key={picture.id} className="ImageGalleryItem">
          <img
            src={picture.webformatURL}
            alt={picture.tags}
            className="ImageGalleryItem-image"
            onClick={() => onClick(picture.largeImageURL, picture.tags)}
          />
        </li>
      ))}
    </>
  )
}

ImageGalleryItem.propTypes = {
  pictures: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
}

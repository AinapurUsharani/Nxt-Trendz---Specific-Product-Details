import './index.css'

const SimilarProductItem = props => {
  const {Details} = props
  const {imageUrl, title, price, brand, rating} = Details

  return (
    <li className="similar-item-container">
      <img src={imageUrl} alt="similar product" className="similar-image" />
      <h1 className="title">{title}</h1>
      <p className="product-brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="price-of-product">Rs {price}/- </p>
        <div className="rating-container">
          <p className="product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem

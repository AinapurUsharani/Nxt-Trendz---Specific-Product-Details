import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatus = {
  initial: 'Initial',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    item: {},
    similarItems: [],
    noOfItems: 1,
    statusIcon: apiStatus.initial,
    error: '',
  }

  componentDidMount() {
    this.getProduct()
  }

  getProduct = async () => {
    this.setState({
      statusIcon: apiStatus.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const url = `https://apis.ccbp.in/products/${id}`

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok) {
      const reqItem = {
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        rating: data.rating,
        totalReviews: data.total_reviews,
        availability: data.availability,
        brand: data.brand,
      }
      const similarItemsList = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        price: each.price,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
      }))

      this.setState({
        item: reqItem,
        similarItems: similarItemsList,
        statusIcon: apiStatus.success,
      })
    }
    if (response.status === 404) {
      const errorMessage = data.error_msg
      this.setState({statusIcon: apiStatus.failure, error: errorMessage})
    }
  }

  decrease = () => {
    const {noOfItems} = this.state
    if (noOfItems > 1) {
      this.setState(prevState => ({noOfItems: prevState.noOfItems - 1}))
    }
  }

  increase = () => {
    this.setState(prevState => ({noOfItems: prevState.noOfItems + 1}))
  }

  renderItem = () => {
    const {item, noOfItems} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      rating,
      totalReviews,
      availability,
      brand,
    } = item

    return (
      <div className="current-product-container">
        <div className="image-container">
          <img src={imageUrl} alt="product" className="image-of-the-product" />
        </div>

        <div className="product-information-container">
          <h1 className="product-title">{title}</h1>
          <p className="price">Rs {price}/-</p>
          <div className="rating-reviews-container">
            <div className="rating-container">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-image"
              />
            </div>
            <p className="reviews">{totalReviews} Reviews</p>
          </div>

          <p className="content">{description}</p>
          <p className="brand-and-available">
            <span className="span">Available: </span>
            {availability}
          </p>
          <p className="brand-and-available">
            <span className="span">Brand: </span>
            {brand}
          </p>
          <hr className="line" />
          <div className="add-product-container">
            <button type="button" onClick={this.decrease} testid="minus">
              <BsDashSquare />
            </button>

            <p className="no-of-items">{noOfItems}</p>
            <button type="button" onClick={this.increase} testid="plus">
              <BsPlusSquare />
            </button>
          </div>

          <button className="add-to-cart-container" type="button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSuccessView = () => {
    const {similarItems} = this.state

    return (
      <div className="required-product-container">
        <Header />
        {this.renderItem()}
        <h1 className="Similar-Products">Similar Products</h1>
        <ul className="similar-product-container">
          {similarItems.map(each => (
            <SimilarProductItem Details={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => {
    const {error} = this.state

    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="Error-heading">{error}</h1>
        <Link to="/products">
          <button type="button" className="button-element2">
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  renderLoading = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {statusIcon} = this.state

    switch (statusIcon) {
      case apiStatus.success:
        return this.renderSuccessView()
      case apiStatus.failure:
        return this.renderFailureView()
      case apiStatus.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }
}

export default ProductItemDetails

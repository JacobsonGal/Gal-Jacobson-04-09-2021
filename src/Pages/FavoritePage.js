import React, { Component } from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import Card from '@material-ui/core/Card'
import weatherService from '../services/weather-service'
import WeatherCard from '../Components/Card'
import Loading from '../Components/Loading'
import './Page.scss'

class FavoritePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      favorites: null,
      isLoading: true
    }
  }
  async componentDidMount () {
    const { getFavorites } = this.props.store
    const favorites = await weatherService.getFavoritesData(toJS(getFavorites))
    this.setState({
      favorites: favorites,
      isLoading: false
    })
  }

  handleFavoriteClick = city => {
    const { addToFavorite } = this.props.store
    addToFavorite(city)
    const { getFavorites } = this.props.store
    const favorites = toJS(getFavorites)
    if (favorites) {
      let idx = favorites?.findIndex(
        fav => fav.id === this.state.selectedCity.id
      )
      if (idx > -1) {
        let arr = favorites.splice(idx, 1)
        this.setState({ favorites: arr })
      }
    }
  }

  render () {
    if (this.state.isLoading) return <Loading />

    return (
      <section className='weather-page slide-in-fwd-center'>
        <div className='day-container'>
          <Card className='card-container'>
            {this.state.favorites.length > 0 ? (
              <WeatherCard
                data={this.state.favorites}
                degree={this.props.degree}
                favPage={true}
                handleFavoriteClick={this.handleFavoriteClick}
              />
            ) : (
              <div className='emptyState'>
                <h2>No Favorites Yet</h2>
              </div>
            )}
          </Card>
        </div>
      </section>
    )
  }
}
export default inject('store')(observer(FavoritePage))

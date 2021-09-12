import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, connect } from 'react-redux'
import { addToFavorites } from '../Redux/actions/favoritesActions'
import Card from '@material-ui/core/Card'
import weatherService from '../services/weather-service'
import WeatherCard from '../Components/Card'
import Loading from '../Components/Loading'
import './Page.scss'

function FavoritePage ({ degree }) {
  const dispatch = useDispatch()
  const [favorites, setFavorites] = useState(
    useSelector(state => state.allFavorites.favorites)
  )
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init () {
      const favoritesData = await weatherService.getFavoritesData(favorites)
      setData(favoritesData)
      setIsLoading(false)
    }
    isLoading && init()
  }, [favorites, data, isLoading, dispatch])

  function handleFavoriteClick (city) {
    dispatch(addToFavorites(city))
  }

  if (isLoading) return <Loading />
  return (
    <section className='weather-page slide-in-fwd-center'>
      <div className='day-container'>
        <Card className='card-container'>
          {data?.length > 0 ? (
            <WeatherCard
              data={data}
              degree={degree}
              favPage={true}
              handleFavoriteClick={handleFavoriteClick}
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
export default connect()(FavoritePage)

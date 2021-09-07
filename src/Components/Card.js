import React, { useState } from 'react'
import { Card, IconButton } from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { NightsStay, WbSunny } from '@material-ui/icons'
import { NavLink } from 'react-router-dom'

export default function WeatherCard ({
  data,
  degree,
  favPage,
  handleFavoriteClick
}) {
  const [favData, setFavData] = useState(data)
  function CityCard (city) {
    let name,
      max,
      min = null
    name = favPage
      ? city.label
      : (name = new Date(new Date(0).setUTCSeconds(city.time))
          .toDateString()
          .substring(city, 3))

    if (favPage) {
      max =
        degree === 'F'
          ? city.temperature.Imperial.Value
          : city.temperature.Metric.Value

      min =
        degree === 'F'
          ? city.temperature.Imperial.Value
          : city.temperature.Metric.Value
    } else {
      max = degree === 'F' ? city.max : Math.ceil(((city.max - 32) * 5) / 9)
      min = degree === 'F' ? city.min : Math.ceil(((city.min - 32) * 5) / 9)
    }

    return (
      <>
        <h1>{name}</h1>
        <h3>
          <WbSunny style={{ color: '#F28C38' }} />
          {max} {'°' + degree}
        </h3>
        <h3>
          <NightsStay style={{ color: '#1f263b' }} />
          {min + '°' + degree}
        </h3>
        <h3 className='weather-info'>{city.weatherText}</h3>
      </>
    )
  }
  return (
    <div className='day-card'>
      {favPage
        ? favData?.map((city, i) => {
            return (
              <Card className='card'>
                <NavLink to={`city/${city.label}/${city.id}`} className='link'>
                  <Card className='card' key={i} style={{ boxShadow: 'none' }}>
                    {CityCard(city)}
                  </Card>
                </NavLink>
                <IconButton
                  onClick={() => {
                    setFavData(
                      data.filter(favorite => {
                        return favorite.id !== city.id
                      })
                    )
                    handleFavoriteClick(city)
                  }}
                  style={{ color: 'rgb(255,0,0)' }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Card>
            )
          })
        : data?.map((city, i) => {
            return (
              <Card className='card' key={i}>
                {CityCard(city)}
              </Card>
            )
          })}
    </div>
  )
}

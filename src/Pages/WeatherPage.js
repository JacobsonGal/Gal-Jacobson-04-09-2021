import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import ReactAutocomplete from 'react-autocomplete'
import weatherService from '../services/weather-service'
import { Card, IconButton } from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import WeatherCard from '../Components/Card'
import Loading from '../Components/Loading'
import './Page.scss'
import { useSelector, useDispatch, connect } from 'react-redux'
import { addToFavorites, setFavorites } from '../Redux/actions/favoritesActions'

function WeatherPage ({ degree, setBright }) {
  const dispatch = useDispatch()
  const favorites = useSelector(state => state.allFavorites.favorites)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [options, setOptions] = useState([])
  const [daysData, setDaysData] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [current, setCurrent] = useState(null)
  const [position, setPosition] = useState(null)

  useEffect(() => {
    async function init () {
      try {
        navigator.geolocation.getCurrentPosition(async position => {
          let location =
            position.coords.latitude + ',' + position.coords.longitude
          var pos = await weatherService.getCurrentPosition(location)
          const curPos = await weatherService.getCurrentWeather(pos.data.Key)
          curPos && curPos.data[0].IsDayTime === true
            ? setBright(true)
            : setBright(false)
          const url = window.location.href
          const cityName = url.toString().split('/')[5]
          const cityId = url.toString().split('/')[6]
          const selected = cityId
            ? { label: cityName.replaceAll('%20', '-'), id: cityId }
            : pos
            ? {
                id: pos.data.Key + '',
                label: pos.data.EnglishName
              }
            : { id: '215854', label: 'Tel-Aviv' }
          let idx = favorites?.findIndex(el => el.id === selected.id)
          const isFavorite = idx > -1 ? true : false
          const data = await weatherService.getFiveDaysForecast(selected.id)
          const fiveDays = weatherService.manageDaysForecasts(data)
          setDaysData(fiveDays)
          setValue('Tel Aviv')
          setSelectedCity(selected)
          setChecked(isFavorite)
          setPosition(pos.data)
          setCurrent(curPos.data[0])
          setIsLoading(false)
        })
      } catch (e) {
        console.log(e)
      }
    }
    isLoading && init()
  }, [favorites, isLoading, selectedCity, setBright])

  function handleFavoriteClick () {
    if (selectedCity) {
      setChecked(!checked)
      dispatch(addToFavorites(selectedCity))
      if (favorites) {
        let idx = favorites?.findIndex(fav => fav.id === selectedCity.id)
        if (idx > -1) {
          let arr = favorites.splice(idx, 1)
          setFavorites(arr)
        }
      }
    }
  }
  async function handleChange (e) {
    setValue(e.target.value)
    if (!/^[a-z]*$/i.test(e.target.value)) {
      const notify = () =>
        toast.error('English Only!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })

      notify()
    } else {
      try {
        const options = await weatherService.getAutoCompOptions(e.target.value)
        const handledOptions = weatherService.manageAutoCompOptions(options)
        setOptions(handledOptions)
      } catch (e) {
        console.log('error on fetching options', e)
      }
    }
  }
  async function handleSelect (val) {
    const selected = options.find(el => el.label === val)
    const data = await weatherService.getFiveDaysForecast(selected.id)
    const forecast = weatherService.manageDaysForecasts(data)
    setSelectedCity(selected)
    setValue(val)
    setDaysData(forecast)
    setChecked(false)
  }

  let name = selectedCity?.label
  let city = daysData[0] ? daysData[0] : null
  let text = daysData[0]?.weatherText
  let max = degree === 'F' ? city?.max : Math.ceil(((city?.max - 32) * 5) / 9)
  let min = degree === 'F' ? city?.min : Math.ceil(((city?.min - 32) * 5) / 9)

  if (isLoading) return <Loading />

  return (
    <section className='weather-page slide-in-fwd-center'>
      <div className='input-section'>
        <h2>Weather</h2>
        <label>Search City </label>
        <div className='search'>
          <ReactAutocomplete
            items={options}
            shouldItemRender={(item, value) =>
              item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
            }
            getItemValue={item => item.label}
            renderItem={(item, highlighted) => (
              <div key={item.id} style={{ color: 'black' }}>
                {item.label}
              </div>
            )}
            value={value}
            onChange={handleChange}
            onSelect={val => handleSelect(val)}
          />
        </div>
      </div>
      <div className='day-container'>
        <Card className='card-container'>
          <div className='day-card-up'>
            <h2>{name}</h2>
            <h3>
              {max} {'°' + degree} {'-'} {min + '°' + degree}
            </h3>

            <h2>{text}</h2>
            <IconButton
              onClick={event => handleFavoriteClick(event)}
              className='iconButton'
              style={{ color: 'rgb(255,0,0)' }}
            >
              {checked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
          <WeatherCard data={daysData} degree={degree} />
        </Card>
      </div>
      <ToastContainer limit={3} />
    </section>
  )
}
export default connect()(WeatherPage)

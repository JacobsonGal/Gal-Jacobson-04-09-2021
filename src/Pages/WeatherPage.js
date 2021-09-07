import React, { Component } from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { toast } from 'react-toastify'
import ReactAutocomplete from 'react-autocomplete'
import weatherService from '../services/weather-service'
import { Card, IconButton } from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import WeatherCard from '../Components/Card'
import Loading from '../Components/Loading'
import './Page.scss'

class WeatherPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      options: [],
      selectedCity: null,
      daysData: [],
      favorites: [],
      checked: true,
      current: null,
      position: null,
      isLoading: true
    }
  }

  async componentDidMount () {
    try {
      const { getFavorites } = this.props.store
      const favoritesList = toJS(getFavorites)
      navigator.geolocation.getCurrentPosition(async position => {
        let location =
          position.coords.latitude + ',' + position.coords.longitude
        var pos = await weatherService.getCurrentPosition(location)
        const curPos = await weatherService.getCurrentWeather(pos.data.Key)
        curPos && curPos.data[0].IsDayTime === true
          ? this.props.setBright(true)
          : this.props.setBright(false)
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
        let idx = favoritesList.findIndex(el => el.id === selected.id)
        const isFavorite = idx > -1 ? true : false
        const data = await weatherService.getFiveDaysForecast(selected.id)
        const fiveDays = weatherService.manageDaysForecasts(data)
        this.setState({
          daysData: fiveDays,
          value: 'Tel Aviv',
          selectedCity: selected,
          favorites: favoritesList,
          checked: isFavorite,
          position: pos.data,
          current: curPos.data[0],
          isLoading: false
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
  handleFavoriteClick = () => {
    const { addToFavorite } = this.props.store
    if (this.state.selectedCity) {
      this.setState((prevState, props) => ({
        checked: !prevState.checked
      }))
      addToFavorite(this.state.selectedCity)
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
  }
  handleChange = async e => {
    this.setState({ value: e.target.value })
    if (!/^[a-z]+$/i.test(e.target.value)) {
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
        this.setState({ options: handledOptions })
      } catch (e) {
        console.log('error on fetching options', e)
      }
    }
  }
  handleSelect = async val => {
    const selected = this.state.options.find(el => el.label === val)
    const data = await weatherService.getFiveDaysForecast(selected.id)
    const forecast = weatherService.manageDaysForecasts(data)
    this.setState({ selectedCity: selected, value: val, daysData: forecast })
  }
  render () {
    const { daysData } = this.state
    let name = this.state.selectedCity?.label
    let city = this.state.daysData[0] ? this.state.daysData[0] : null
    let text = this.state.daysData[0]?.weatherText
    let degree = this.props.degree
    let max = degree === 'F' ? city?.max : Math.ceil(((city?.max - 32) * 5) / 9)
    let min = degree === 'F' ? city?.min : Math.ceil(((city?.min - 32) * 5) / 9)

    if (this.state.isLoading) return <Loading />

    return (
      <section className='weather-page slide-in-fwd-center'>
        <div className='input-section'>
          <h2>Weather</h2>
          <label>Search City </label>
          <div className='search'>
            <ReactAutocomplete
              items={this.state.options}
              shouldItemRender={(item, value) =>
                item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
              }
              getItemValue={item => item.label}
              renderItem={(item, highlighted) => (
                <div key={item.id} style={{ color: 'black' }}>
                  {item.label}
                </div>
              )}
              value={this.state.value}
              onChange={this.handleChange}
              onSelect={val => this.handleSelect(val)}
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
                onClick={event => this.handleFavoriteClick(event)}
                className='iconButton'
                style={{ color: 'rgb(255,0,0)' }}
              >
                {this.state.checked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </div>
            <WeatherCard data={daysData} degree={this.props.degree} />
          </Card>
        </div>
      </section>
    )
  }
}
export default inject('store')(observer(WeatherPage))

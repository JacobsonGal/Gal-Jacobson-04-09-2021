import axios from 'axios'
// const KEY = 'jWUw008xsKJCrgLNMipmSkprGmEazaIS'
// const KEY = 'gwmef8ApO2ujAcSGELpJBayAXwYQPX5I'
const KEY = '8wq4uyHKbMZTvfCwSnjsyl3gijm4RHl2'

async function getFavoritesData (favorites) {
  let arr = []
  for (let idx = 0; idx < favorites.length; idx++) {
    let fav = favorites[idx]
    try {
      let req = `https://dataservice.accuweather.com/currentconditions/v1/${fav.id}?apikey=${KEY}&language=en-us&details=falseHTTP/1.1`
      let favInfo = await axios.get(req)
      favInfo = favInfo.data[0]
      fav.isDayTime = favInfo.IsDayTime
      fav.temperature = favInfo.Temperature
      fav.weatherText = favInfo.WeatherText
      arr.push(fav)
    } catch (e) {}
  }
  return arr
}
async function getFiveDaysForecast (cityId) {
  const req = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityId}?apikey=${KEY}&language=en-us&details=false&metric=false%20HTTP/1.1`
  return axios.get(req)
}
async function getAutoCompOptions (val) {
  const req = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${KEY}&q=${val}&language=en-us HTTP/1.1`
  return axios.get(req)
}
async function getCurrentPosition (location) {
  const req = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${KEY}&q=${location}`
  return axios.get(req)
}
async function getCurrentWeather (val) {
  const req = `http://dataservice.accuweather.com/currentconditions/v1/${val}?apikey=${KEY}`
  return axios.get(req)
}
function manageAutoCompOptions (options) {
  var arr = options.data.reduce((acc, el) => {
    acc.push({ id: el.Key, label: el.LocalizedName })
    return acc
  }, [])

  return arr
}
function manageDaysForecasts (forecast) {
  return forecast.data.DailyForecasts.reduce((acc, el) => {
    acc.push({
      time: el.EpochDate,
      min: el.Temperature.Minimum.Value,
      max: el.Temperature.Maximum.Value,
      weatherText: el.Day.IconPhrase
    })
    return acc
  }, [])
}
const weatherService = {
  manageAutoCompOptions,
  manageDaysForecasts,
  getCurrentWeather,
  getFiveDaysForecast,
  getFavoritesData,
  getAutoCompOptions,
  getCurrentPosition
}
export default weatherService

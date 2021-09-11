import React, { useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme, GlobalStyles } from './Components/Theme'
import FavoritePage from './Pages/FavoritePage'
import WeatherPage from './Pages/WeatherPage'
import Navigation from './Components/Navigation'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

toast.configure()
export default function App () {
  const [Degree, setDegree] = useState('C')
  const [Bright, setBright] = useState(true)
  return (
    <ThemeProvider theme={Bright === true ? lightTheme : darkTheme}>
      <GlobalStyles />
      <div className='App'>
        <HashRouter>
          <Navigation
            degree={Degree}
            bright={Bright}
            setDegree={setDegree}
            setBright={setBright}
          />
          <Switch>
            <Route exact path='/'>
              <WeatherPage
                degree={Degree}
                bright={Bright}
                setBright={setBright}
              />
            </Route>
            <Route exact path='/city/:cityName/:cityId'>
              <WeatherPage
                degree={Degree}
                bright={Bright}
                setBright={setBright}
              />
            </Route>
            <Route exact path='/favorites'>
              <FavoritePage degree={Degree} bright={Bright} />
            </Route>
          </Switch>
        </HashRouter>
      </div>
    </ThemeProvider>
  )
}

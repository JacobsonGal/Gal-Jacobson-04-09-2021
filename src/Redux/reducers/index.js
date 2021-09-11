import { combineReducers } from 'redux'
import { favoriteReducer } from './favoriteReducer'

export default combineReducers({
  allFavorites: favoriteReducer
})

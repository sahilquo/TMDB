
export const BASE_URL = 'https://api.themoviedb.org/3'
export const API_KEY = '5ba0469fcc904ef9a53d713966d583c1'
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original/'


// /trending/{media_type}/{time_window}
//  media_type = movie/tv/person/all
//  time_window = day/week

// Movies
export const API_MOVIES_POPULAR = '/movie/popular'
export const API_MOVIES_NOW_PLAYING = '/movie/now_playing'
export const API_MOVIES_TOP_RATED = '/movie/top_rated'
export const API_MOVIES_UPCOMING = '/movie/upcoming'
export const API_MOVIES_GENRES = '/genre/movie/list'
export const API_MOVIES_TRENDING = '/trending/movie/day'

// TV
export const API_TV_AIRING_TODAY = '/tv/airing_today'
export const API_TV_TOP_RATED = '/tv/top_rated'
export const API_TV_POPULAR = '/tv/popular'
export const API_TV_TRENDING = '/trending/tv/day'
export const API_TV_GENRES = '/genre/tv/list'

// Celebrities
export const API_PERSON_POPULAR = '/person/popular'
export const API_PERSON_TRENDING = '/trending/person/day'

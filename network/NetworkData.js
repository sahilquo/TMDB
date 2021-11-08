
export const BASE_URL = 'https://api.themoviedb.org/3'
export const API_KEY = '5ba0469fcc904ef9a53d713966d583c1'
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original/'
export const YOUTUBE_THUBNAIL_BASE_URL = 'https://i.ytimg.com/vi'
//https://i.ytimg.com/vi/A47y6VJNols/mqdefault.jpg


// Movies
export const API_MOVIES_POPULAR = '/movie/popular'
export const API_MOVIES_NOW_PLAYING = '/movie/now_playing'
export const API_MOVIES_TOP_RATED = '/movie/top_rated'
export const API_MOVIES_UPCOMING = '/movie/upcoming'
export const API_MOVIES_GENRES = '/genre/movie/list'
export const API_MOVIES_TRENDING = '/trending/movie/day'

export const API_MOVIE_DETAIL = '/movie/{movie_id}'
export const API_MOVIE_RECOMMENDATIONS = '/movie/{movie_id}/recommendations'
export const API_MOVIE_SIMILAR = '/movie/{movie_id}/similar'
export const API_MOVIE_VIDEOS = '/movie/{movie_id}/videos'
export const API_MOVIE_CREDITS = '/movie/{movie_id}/credits'

export const API_MOVIE_COLLECTION_DETAIL = '/collection/{collection_id}'

// TV
export const API_TV_AIRING_TODAY = '/tv/airing_today'
export const API_TV_TOP_RATED = '/tv/top_rated'
export const API_TV_POPULAR = '/tv/popular'
export const API_TV_TRENDING = '/trending/tv/day'
export const API_TV_GENRES = '/genre/tv/list'

export const API_TV_DETAIL = '/tv/{tv_id}'
export const API_TV_RECOMMENDATIONS = '/tv/{tv_id}/recommendations'
export const API_TV_SIMILAR = '/tv/{tv_id}/similar'
export const API_TV_VIDEOS = '/tv/{tv_id}/videos'
export const API_TV_CREDITS = '/tv/{tv_id}/credits'

export const API_TV_SEASON_DETAIL = '/tv/{tv_id}/season/{season_number}'

// Celebrities
export const API_PERSON_POPULAR = '/person/popular'
export const API_PERSON_TRENDING = '/trending/person/day'
export const API_PERSON_DETAIL = '/person/{person_id}'
export const API_PERSON_MOVIES = '/person/{person_id}/movie_credits'
export const API_PERSON_TV_SHOWS = '/person/{person_id}/tv_credits'

export const VAR_MOVIE_ID = '{movie_id}'
export const VAR_TV_ID = '{tv_id}'
export const VAR_PERSON_ID = '{person_id}'
export const VAR_COLLECTION_ID = '{collection_id}'
export const VAR_SEASON_NUMBER = '{season_number}'

export const PARAM_LANGUAGE = 'language'
export const PARAM_REGION = 'region'
export const PARAM_APPEND_TO_RESPONSE = 'append_to_response'
export const PARAM_PAGE = 'page'

export const PARAM_LANGUAGE_VALUE = 'en-IN'
export const PARAM_REGION_VALUE = 'IN'
export const PARAM_MOVIES_ATR_VALUE = 'credits,videos,recommendations,similar'
export const PARAM_TV_ATR_VALUE = 'credits,videos,recommendations,similar'
export const PARAM_PERSON_ATR_VALUE = 'movie_credits,tv_credits'
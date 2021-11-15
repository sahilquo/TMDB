import React from 'react';
import { API_KEY, BASE_URL } from './NetworkData';

export const GET = (url, onComplete, onError) => {
    fetch(url)
        .then((response) => response.json())
        .then((json) => onComplete(json))
        .catch((error) => onError(error));
}

export const GET_ALL = (urls, onComplete, onError) => {
    Promise.all(urls.map(url => fetch(url)))
        .then((responses) => {
            return Promise.all(responses.map((response) => {
                return response.json()
            }));
        })
        .then((jsons) => onComplete(jsons))
        .catch((error) => onError(error));
}

export const createUrl = (endpoint, params) => {
    let url = BASE_URL + endpoint + '?api_key=' + API_KEY
    if (params != null) {
        const keys = Object.keys(params);
        keys.forEach(key => {
            url += `&${key}=${params[key]}`
        });
    }
    return url;
}
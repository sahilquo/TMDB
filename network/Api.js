import React from 'react';
import { API_KEY, BASE_URL } from './NetworkData';

export const GET = (endpoint, onComplete, onError) => {
    fetch(BASE_URL + endpoint + '?api_key=' + API_KEY)
        .then((response) => response.json())
        .then((json) => onComplete(json))
        .catch((error) => onError(error));
}

export const GET_ALL = (endpoints, onComplete, onError) => {
    Promise.all(endpoints.map((endpoint) => {
        return fetch(BASE_URL + endpoint + '?api_key=' + API_KEY)
    }))
        .then((responses) => {
            return Promise.all(responses.map((response) => {
                return response.json()
            }));
        })
        .then((jsons) => onComplete(jsons))
        .catch((error) => {
            onError(error)
        });
}
import Axios from 'axios';
import { baseApiUrl } from 'core';
import { HotelEntityModel, Cities } from '../api/api.model';

const hotelsUrl = `${baseApiUrl}/api/hotels`;
const citiesUrl = `${baseApiUrl}/api/cities`;

export const getHotelById = (id: string) : Promise<HotelEntityModel> => {
    const hotelUrl = `${hotelsUrl}?id=${id}`;
    return new Promise((resolve, reject) => {
        Axios.get(hotelUrl)
            .then((response) => {
                resolve(response.data[0])
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const getCities = (): Promise<Cities> => {
    return new Promise((resolve, reject) => {
        Axios.get(citiesUrl)
            .then((response) => {
                resolve(response.data);
            }).catch((err) => {
                reject(err);
            })
    });
}

export const createHotel = (hotel: HotelEntityModel): Promise<HotelEntityModel> => (
    new Promise((resolve, reject) => {
        hotel.id = void 0;
        Axios.post(hotelsUrl, hotel)
            .then((response) => {
                resolve(response.data);
            }).catch((err) => {
                reject(err);
            });
    })
);

export const updateHotel = (id: string) => (hotel: HotelEntityModel): Promise<HotelEntityModel> => (
    new Promise((resolve, reject) => {
        const url = `${hotelsUrl}/${id}`;
        Axios.put(url, hotel)
            .then((response) => {
                resolve(response.data);
            }).catch((err) => {
                reject(err);
            });
    })
);
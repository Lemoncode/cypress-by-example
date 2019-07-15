import { HotelEntityVm } from './hotel-edit.vm';
import { HotelEntityModel } from '../api/api.model';

export const mapFromApiToVm = (apiEnity: HotelEntityModel): HotelEntityVm => ({
    id:apiEnity.id,
    city: apiEnity.city,
    description: apiEnity.shortDescription,
    name: apiEnity.name,
    rating: apiEnity.hotelRating,
    picture: apiEnity.thumbNailUrl,
});

const hotel = {
    "id": "0248058a-27e4-11e6-ace6-a9876eff01b3",
    "type": "hotel",
    "name": "Motif Seattle",
    "created": 1464777092568,
    "modified": 1464777618676,
    "address1": "1415 5th Ave",
    "airportCode": "SEA",
    "amenityMask": 7798786,
    "city": "Seattle",
    "confidenceRating": 52,
    "countryCode": "US",
    "deepLink": "http://www.travelnow.com/templates/55505/hotels/125727/overview?lang=en&amp;currency=USD&amp;standardCheckin=null/null/null&amp;standardCheckout=null/null/null",
    "highRate": 289,
    "hotelId": 1257278,
    "hotelInDestination": true,
    "hotelRating": 4,
    "location": {
        "latitude": 47.60985,
        "longitude": -122.33475
    },
    "locationDescription": "Near Pike Place Market",
    "lowRate": 259,
    "metadata": {
        "path": "/hotels/0248058a-27e4-11e6-ace6-a9876eff01b3"
    },
    "postalCode": 98101,
    "propertyCategory": 1,
    "proximityDistance": 11.168453,
    "proximityUnit": "MI",
    "rateCurrencyCode": "USD",
    "shortDescription": "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
    "stateProvinceCode": "WA",
    "thumbNailUrl": "/thumbnails/50947_264_t.jpg",
    "tripAdvisorRating": 3.5,
    "tripAdvisorRatingUrl": "http://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/3.5-12345-4.gif"
}
const baseHotel = hotel as any;

export const mapFromVmToApi = (hotelVm: HotelEntityVm): HotelEntityModel => ({
    ...baseHotel,
    id: hotelVm.id,
    city: hotelVm.city,
    shortDescription: hotelVm.description,
    name: hotelVm.name,
    hotelRating: hotelVm.rating,
    thumbNailUrl: hotelVm.picture,
})
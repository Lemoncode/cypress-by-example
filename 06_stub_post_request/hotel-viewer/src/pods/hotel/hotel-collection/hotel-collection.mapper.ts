import { HotelEntityModel } from '../api/api.model';
import { HotelEntityVm } from './hotel-collection.vm';
import { basePictureUrl } from 'core';

export const mapFromApiToVm = (apiEntity: HotelEntityModel): HotelEntityVm => ({
    id: apiEntity.id,
    picture: `${basePictureUrl}${apiEntity.thumbNailUrl}`,
    name: apiEntity.name,
    description: apiEntity.shortDescription,
    rating: apiEntity.hotelRating,
    address: apiEntity.address1,
});

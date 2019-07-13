import Axios from 'axios';
import { baseApiUrl } from 'core';
import { HotelEntityModel } from '../api/api.model';


const getHotelsUrl = `${baseApiUrl}/api/hotels`;

// TODO: Just only managing the "happy path", adding error handling here or upper level 
// would be a good idea
export const getHotelCollection = () : Promise<HotelEntityModel[]> => {  
  const promise = new Promise<HotelEntityModel[]>((resolve, _) => 
    Axios.get<HotelEntityModel[]>(getHotelsUrl).then((response) => resolve(response.data)
  ));

  return promise;
} 
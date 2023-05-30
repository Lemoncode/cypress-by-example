import Axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

const delay = (offset: number) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(void 0);
  }, offset);
});

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const { data } = await Axios.get<HotelEntityApi[]>(url);
  // await delay(4000);
  return data;
};

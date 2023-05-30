import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from './api';
import { createEmptyHotel, Hotel } from './hotel-edit.vm';
import {
  mapHotelFromApiToVm,
  mapHotelFromVmToApi,
} from './hotel-edit..mappers';
import { HotelEditComponent } from './hotel-edit.component';
import { Lookup } from 'common/models';
import { linkRoutes } from 'core/router';

const isEditMode = (id: string) => id !== '0';

export const HotelEditContainer: React.FunctionComponent = (props) => {
  const [hotel, setHotel] = React.useState<Hotel>(createEmptyHotel());
  const [cities, setCities] = React.useState<Lookup[]>([]);
  const { id } = useParams<any>();
  const navigate = useNavigate();

  const loadEditMode = async () => {
    const [apiHotel, apiCities] = await Promise.all([
      api.getHotel(id),
      api.getCities(),
    ]);
    setHotel(mapHotelFromApiToVm(apiHotel));
    setCities(apiCities);
  };

  const loadCreateMode = async () => {
    const apiCities = await api.getCities();
    setCities(apiCities);
  };

  const handleLoadData = async () => {
    if (isEditMode(id)) {
      await loadEditMode();
    } else {
      await loadCreateMode();
    }
  };

  React.useEffect(() => {
    handleLoadData();
  }, []);

  const handleSave = async (hotel: Hotel) => {
    const apiHotel = mapHotelFromVmToApi(hotel);
    
    try {
      if (isEditMode(id)) {
        await api.updateHotel(apiHotel)
      } else {
        await api.saveHotel(apiHotel);
      }
      navigate(linkRoutes.hotelCollection);
    } catch (error) {
      alert('Error on save hotel');
    }
  };

  return (
    <HotelEditComponent hotel={hotel} cities={cities} onSave={handleSave} />
  );
};

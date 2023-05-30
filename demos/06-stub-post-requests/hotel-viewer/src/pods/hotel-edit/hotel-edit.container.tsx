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
      // http://localhost:8080/#/hotel-edit/0
      await loadCreateMode();
    }
  };

  React.useEffect(() => {
    handleLoadData();
  }, []);

  const handleSave = async (hotel: Hotel) => {
    const apiHotel = mapHotelFromVmToApi(hotel);
    // const success = await api.saveHotel(apiHotel);
    let success = false;
    
    if (isEditMode(id)) {
      success = await api.updateHotel(apiHotel);
    } else {
      success = await api.saveHotel(apiHotel);
    }

    if (success) {
      navigate(linkRoutes.hotelCollection);
    } else {
      alert('Error on save hotel');
    }
  };

  return (
    <HotelEditComponent hotel={hotel} cities={cities} onSave={handleSave} />
  );
};

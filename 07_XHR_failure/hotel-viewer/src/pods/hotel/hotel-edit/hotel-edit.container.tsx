import * as React from 'react';
import { HotelEditComponent } from './hotel-edit.component';
import { HotelEntityVm, createEmptyHotelVm } from './hotel-edit.vm';
import {
    getHotelById,
    getCities,
    createHotel,
    updateHotel
} from './hotel-edit.api';
import { mapFromApiToVm, mapFromVmToApi } from './hotel-edit.mapper';
import { Cities, HotelEntityModel } from 'pods/hotel/api/api.model';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { routesLinks } from 'core';


interface Props extends RouteComponentProps {
    hotelId: string;
}

const useCities = () => {
    const [cities, setCities] = React.useState<Cities>([]);

    const loadCities = () => (
        getCities().then(
            (result) => setCities(result)
        )
    );

    return { cities, loadCities }
}

const useHotelEdit = () => {
    const [hotel, setHotel] = React.useState<HotelEntityVm>(createEmptyHotelVm());

    const loadHotel = (id: string) => (
        getHotelById(id).then(
            (result) => setHotel(mapFromApiToVm(result))
        )
    );

    return { hotel, loadHotel, setHotel }
}

const HotelEditContainerInner = (props: Props) => {
    const { cities, loadCities } = useCities();
    const { hotel, loadHotel, setHotel } = useHotelEdit();
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        if (props.hotelId !== 'new') {
            loadHotel(props.hotelId);
        }
    }, []);

    React.useEffect(() => {
        loadCities();
    }, []);

    const onUpdateFormField = (name: keyof HotelEntityVm, value: string | number): void => {
        setHotel({
            ...hotel,
            [name]: value
        })
    }

    const upsertEnity = (hotel: HotelEntityVm): Promise<HotelEntityModel> => {
        const operation = (props.hotelId === 'new') ? createHotel : updateHotel(props.hotelId);
        return operation(
            mapFromVmToApi(hotel)
        );
    }

    const onSubmitForm = (evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.stopPropagation();
        evt.preventDefault();
        upsertEnity(hotel)
            .then(() => {
                props.history.push(routesLinks.hotelCollection);
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    const onClose = () => {
        setError('');
    }

    return (
        <>
            <HotelEditComponent
                cities={cities}
                hotel={hotel}
                onSubmitForm={onSubmitForm}
                onUpdateFormField={onUpdateFormField}
                error={error}
                onClose={onClose}
            />
        </>
    );
}

export const HotelEditContainer = withRouter<Props, any>(HotelEditContainerInner);
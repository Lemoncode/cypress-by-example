import * as React from 'react';
import Button from '@material-ui/core/Button';
import Rating from 'material-ui-rating';
import { ErrorMessageComponent } from 'common/components';

import { HotelEntityVm } from './hotel-edit.vm';
import {
    SelectFieldFormComponent,
    TextFieldForm
} from 'common/components';


interface Props {
    hotel: HotelEntityVm;
    cities: string[];
    onUpdateFormField: (name: keyof HotelEntityVm, value: string | number) => void;
    onSubmitForm: (evt: React.MouseEvent<HTMLButtonElement>) => void;
    error?: string;
    onClose?: () => void;
}

export const HotelEditComponent = (props: Props) => {
    const { hotel, cities, onSubmitForm, onUpdateFormField, error, onClose } = props;

    const onUpdateRating = (rating) => {
        onUpdateFormField('rating', rating);
    }

    const onUpdateSelectedCity = (city) => {
        onUpdateFormField('city', city);
    }

    return (
        <>
            <ErrorMessageComponent errorMessage={error} onClose={onClose} open={!!error} />
            <form autoComplete="off">
                <div>
                    <TextFieldForm
                        label="Name"
                        name="name"
                        onChange={onUpdateFormField}
                        value={hotel.name}
                        style={{ marginLeft: '7px' }}
                    />
                    <TextFieldForm
                        label="Picture"
                        name="picture"
                        onChange={onUpdateFormField}
                        value={hotel.picture}
                        style={{ marginLeft: '7px' }}
                    />
                </div>
                <div>
                    <TextFieldForm
                        label="Description"
                        name="description"
                        onChange={onUpdateFormField}
                        value={hotel.description}
                        style={{ marginLeft: '7px', minWidth: '25rem' }}
                        multiline={true}
                        rows={5}
                    />
                </div>
                <SelectFieldFormComponent
                    values={cities}
                    value={hotel.city}
                    label="cities"
                    onChange={onUpdateSelectedCity}
                />
                <Rating
                    max={5}
                    value={hotel.rating}
                    onChange={onUpdateRating}
                />
                <div>
                    <Button onClick={onSubmitForm}>Save</Button>
                </div>
            </form>
        </>
    );
}
import * as React from 'react';
import { HotelCollectionComponent } from './hotel-collection.component';
import { FilterOptions } from './components/hotel-filter-panel.component';
import { HotelEntityVm } from './hotel-collection.vm';
import { getHotelCollection } from './hotel-collection.api';
import { mapFromApiToVm } from './hotel-collection.mapper';
import { mapFromAToBCollection } from 'common';

const useHotelCollection = () => {
    const loadHotelCollection = () => (
        getHotelCollection().then(
            (result) => mapFromAToBCollection(mapFromApiToVm, result)
        )
    );

    return { loadHotelCollection };
}

const filterReactions = (hotelCollection: HotelEntityVm[]) => (filterOption: FilterOptions) => {
    const reactions = {
        'all': () => hotelCollection,
        'bad': () => hotelCollection.filter((h) => h.rating >= 0 && h.rating < 2.5),
        'good': () => hotelCollection.filter((h) => h.rating >= 2.5 && h.rating < 4),
        'excellent': () => hotelCollection.filter((h) => h.rating >= 4),
    }
    return reactions[filterOption]();
};
let filterReactionsInit;


export const HotelCollectionContainer = () => {
    const { loadHotelCollection } = useHotelCollection();
    const [filteredCollection, setFilteredCollection] = React.useState([]);
    
    const onClickFilterOption = (filterOption: FilterOptions) => {
        setFilteredCollection(
            filterReactionsInit(filterOption)
        );
    };
    
    React.useEffect(() => {
        loadHotelCollection()
            .then((result) => {
                filterReactionsInit = filterReactions(result);
                setFilteredCollection([...result]);
            });
    }, []);
    
    return (
        <HotelCollectionComponent 
            onClickFilterOption={onClickFilterOption}
            hotelCollection={filteredCollection}
        />
    );
}
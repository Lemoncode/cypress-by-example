import * as React from 'react';
import { HotelCollectionComponent } from './hotel-collection.component';
import {
  HotelFilterComponent,
  FilterOptions,
} from './components/hotel-filter-panel.component';
import { useHotelCollection } from './hotel-collection.hook';
import * as classes from './hotel-collection.styles';
import { HotelEntityVm } from './hotel-collection.vm';

const filterReactions =
  (hotelCollection: HotelEntityVm[]) => (filterOption: FilterOptions) => {
    const reactions = {
      all: () => hotelCollection,
      bad: () => hotelCollection.filter((h) => h.rating >= 0 && h.rating < 2.5),
      good: () =>
        hotelCollection.filter((h) => h.rating >= 2.5 && h.rating < 4),
      excellent: () => hotelCollection.filter((h) => h.rating >= 4),
    };
    return reactions[filterOption]();
  };

let doFilterReactions;

export const HotelCollectionContainer = () => {
  const { hotelCollection, loadHotelCollection } = useHotelCollection();
  const [filterOption, setFilterOption] = React.useState<FilterOptions>('all');
  const [filteredCollection, setFilteredCollection] = React.useState<
    HotelEntityVm[]
  >([]);

  React.useEffect(() => {
    loadHotelCollection();
  }, []);

  React.useEffect(() => {
    if (hotelCollection && hotelCollection.length > 0) {
      doFilterReactions = filterReactions(hotelCollection);
    }
  }, [hotelCollection]);

  React.useEffect(() => {
    if (hotelCollection && hotelCollection.length > 0) {
      setFilteredCollection(doFilterReactions(filterOption));
    }
  }, [filterOption, hotelCollection]);

  return (
    <>
      <HotelFilterComponent
        onClickFilterOption={setFilterOption}
        className={classes.filterLayout}
      />

      <HotelCollectionComponent hotelCollection={filteredCollection} />
    </>
  );
};

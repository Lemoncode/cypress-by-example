import * as React from 'react';
import {
    withStyles,
    createStyles,
    WithStyles
} from '@material-ui/core/styles';
import { HotelEntityVm } from './hotel-collection.vm';
import { HotelCard } from './components/hotel-card.component';
import { HotelFilterComponent, FilterOptions } from './components/hotel-filter-panel.component';

const styles = (theme) => createStyles({
    listLayout: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    filterLayout: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem'
    }
});

interface Props extends WithStyles<typeof styles> {
    hotelCollection: HotelEntityVm[];
    onClickFilterOption: (filterOption: FilterOptions) => void;
}

const HotelCollectionComponentInner = (props: Props) => {
    const { hotelCollection, classes, onClickFilterOption } = props;
    return (
        <>
            <div className={classes.filterLayout}>
                <HotelFilterComponent onClickFilterOption={onClickFilterOption} />
            </div>
            <div className={classes.listLayout}>
                {
                    hotelCollection.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
                }
            </div>
        </>
    );
}

export const HotelCollectionComponent = withStyles(styles)(HotelCollectionComponentInner);
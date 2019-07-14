import * as React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

export type FilterOptions = 'all' | 'bad' | 'good' | 'excellent';

interface Props {
    onClickFilterOption: (filterOption: FilterOptions) => void;
}

export const HotelFilterComponent = (props: Props) => {
    const filterOptitonHandler = (filterOption: FilterOptions) =>
        () => props.onClickFilterOption(filterOption);
    return (
        <>
            <ButtonGroup size="small">
              <Button onClick={filterOptitonHandler('all')}>
                  all
              </Button>
              <Button onClick={filterOptitonHandler('bad')}>
                  bad
              </Button>
              <Button onClick={filterOptitonHandler('good')}>
                  good
              </Button>
              <Button onClick={filterOptitonHandler('excellent')}>
                  excellent
              </Button>
            </ButtonGroup>
        </>
    );
}
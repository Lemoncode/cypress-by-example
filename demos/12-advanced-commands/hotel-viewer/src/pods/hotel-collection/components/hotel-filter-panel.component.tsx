import * as React from 'react';
import { Button, ButtonGroup } from '@mui/material';

export type FilterOptions = 'all' | 'bad' | 'good' | 'excellent';

interface Props {
  onClickFilterOption: (filterOptions: FilterOptions) => void;
  className?: string;
}

export const HotelFilterComponent: React.FC<Props> = (props: Props) => {
  const filterOptionHandler = (filterOption: FilterOptions) => () =>
    props.onClickFilterOption(filterOption);

  return (
    <ButtonGroup className={props.className}>
      <Button onClick={filterOptionHandler('all')}>all</Button>
      <Button onClick={filterOptionHandler('bad')}>bad</Button>
      <Button onClick={filterOptionHandler('good')}>good</Button>
      <Button onClick={filterOptionHandler('excellent')}>excellent</Button>
    </ButtonGroup>
  );
};

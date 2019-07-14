import * as React from 'react';

import { AppLayout } from 'layout';
import { HotelEditContainer } from 'pods/hotel/hotel-edit';
import { RouteComponentProps } from 'react-router';

export const HotelEditPage = (props: RouteComponentProps) => {
    const { match } = props;
    const params = match.params as any;
    return (
        <AppLayout>
            <HotelEditContainer hotelId={params.id} />
        </AppLayout>
    );
}
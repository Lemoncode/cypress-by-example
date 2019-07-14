export interface HotelEntityVm {
    id: string;
    name: string;
    picture: string;
    rating: number;
    city: string;
    description: string;
}

export const createEmptyHotelVm = () => ({
    id: '',
    city: '',
    description: '',
    name: '',
    picture: '',
    rating: 0,
});
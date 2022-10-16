export type TodoType = {
    id?: number; // id not required in data for newly added record, will be defined by api
    title: string;
    items: ItemType[];
};

export type ItemType = {
    id: string; // uuid used to define ID
    title: string;
    description: string;
    date: string;
    finished: boolean;
};

export type FiltersCountType = {
    all: number;
    active: number;
    finished: number;
    missed: number;
};
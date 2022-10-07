export type TodoType = { 
    id?: number; // id is not required in data for newly added record
    title: string;
    items: ItemType[]; 
};

export type ItemType = { 
    id?: number; // id is not required in data for newly added record
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

export type GetTodosResponse = {
    data: TodoType[];
};
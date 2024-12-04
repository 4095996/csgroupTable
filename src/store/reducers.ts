import { ColumnProps } from 'antd/lib/table';
import {
    ADD_COLUMN,
    REMOVE_COLUMN,
    UPDATE_DATA,
    SET_COLUMN_TYPE,
} from './action';
import { DataType } from './types';

interface State {
    columns: ColumnProps<DataType>[];
    data: DataType[];
    columnTypes: { [key: string]: 'string' | 'percent' };
}

export const initialState: State = {
    columns: [],
    data: [],
    columnTypes: {},
};

const rootReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case ADD_COLUMN:
            return {
                ...state,
                columns: [...state.columns, action.payload],
                columnTypes: { ...state.columnTypes, [action.payload.key]: 'string' },
            };
        case REMOVE_COLUMN:
            const { [action.payload]: removedColumnType, ...restColumnTypes } =
                state.columnTypes;
            return {
                ...state,
                columns: state.columns.filter(
                    (column) => column.key !== action.payload
                ),
                columnTypes: restColumnTypes,
            };
        case UPDATE_DATA:
            return {
                ...state,
                data: action.payload,
            };
        case SET_COLUMN_TYPE:
            return {
                ...state,
                columnTypes: {
                    ...state.columnTypes,
                    [action.payload.key]: action.payload.columnType,
                },
            };
        default:
            return state;
    }
};

export default rootReducer;
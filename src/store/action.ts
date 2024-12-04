import { ColumnProps } from 'antd/lib/table';
import { DataType } from './types';
export const ADD_COLUMN = 'ADD_COLUMN';
export const REMOVE_COLUMN = 'REMOVE_COLUMN';
export const UPDATE_DATA = 'UPDATE_DATA';
export const SET_COLUMN_TYPE = 'SET_COLUMN_TYPE';

export const addColumn = (column: ColumnProps<DataType>) => ({
    type: ADD_COLUMN,
    payload: column,
});

export const removeColumn = (key: string) => ({
    type: REMOVE_COLUMN,
    payload: key,
});

export const updateData = (data: DataType[]) => ({
    type: UPDATE_DATA,
    payload: data,
});

export const setColumnType = (key: string, columnType: 'string' | 'percent') => ({
    type: SET_COLUMN_TYPE,
    payload: { key, columnType },
});
import React from 'react';
import { ColumnProps } from 'antd/lib/table';
export interface TableComponentProps {
    columns: ColumnProps<DataType>[];
    data: DataType[];
    columnTypes: { [key: string]: 'string' | 'percent' };
    addColumn: (column: ColumnProps<DataType>) => void;
    removeColumn: (key: string) => void;
    updateData: (data: DataType[]) => void;
    setColumnType: (key: string, columnType: 'string' | 'percent') => void;
}
export interface EditCell {
    recordKey: string;
    dataIndex: string;
    value: any;
}
export interface DataType {
    key: string;
    [key: string]: string | number;
}
export interface IModifiedColumns {
    dataIndex: string;
    key: string;
    title: React.ReactNode;
    render: (text: string | number, record: DataType) => React.ReactNode;
}
export interface StateProps {
    columns: IModifiedColumns[];
    data: DataType[];
    columnTypes: Record<string, 'string' | 'percent'>;
}
export interface DispatchProps {
    addColumn: (column: IModifiedColumns) => void;
    removeColumn: (key: string) => void;
    updateData: (data: DataType[]) => void;
    setColumnType: (key: string, columnType: 'string' | 'percent') => void;
}
export interface RootState {
    columns: IModifiedColumns[];
    data: DataType[];
    columnTypes: Record<string, 'string' | 'percent'>;
}
export interface StateProps {
    columns: IModifiedColumns[];
    data: DataType[];
    columnTypes: Record<string, 'string' | 'percent'>;
}
export interface OwnProps {}
export interface DispatchProps {
    addColumn: (column: IModifiedColumns) => void;
    removeColumn: (key: string) => void;
    updateData: (data: DataType[]) => void;
    setColumnType: (key: string, columnType: 'string' | 'percent') => void;
}
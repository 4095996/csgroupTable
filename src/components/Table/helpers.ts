import {DataType, IModifiedColumns} from "../../interfaces";
import {Form, Input, message, Select} from "antd";
import React from "react";

export const isValidNumber = (value: string | number): boolean => {
    return !isNaN(parseFloat(String(value))) && isFinite(Number(value));
};

export const generateJsonData = (data: DataType[]): string => {
    return JSON.stringify(data, null, 2);
};

export const handleColumnTypeChange = (
    key: string,
    columnType: 'string' | 'percent',
    data: DataType[],
    setColumnType: (key: string, columnType: 'string' | 'percent') => void
) => {
    if (columnType === 'percent' && data.length > 0) {
        const isAllValuesIsNumber = data.map(item => item[key]).every(item => Number(item) || item === '' || item === undefined);

        if (!isAllValuesIsNumber) {
            message.error('Невозможно изменить тип колонки, т.к. не все значения в ячейках соответствуют числу');
            return;
        }
    }
    setColumnType(key, columnType);
};

export const createNewRow = (columns: IModifiedColumns[]): DataType => {
    const newRow: DataType = { key: Date.now().toString() };
    columns.forEach((column) => {
        newRow[column.dataIndex] = '';
    });
    return newRow;
};

export const getModalTitle = (modalType: string | null) => {
    switch (modalType) {
        case 'addColumn':
            return 'Добавить новую колонку';
        case 'editCell':
            return 'Редактировать ячейку';
        case 'generateJson':
            return 'Сгенерировать JSON';
        default:
            return '';
    }
};
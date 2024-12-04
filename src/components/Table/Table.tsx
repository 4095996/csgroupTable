import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Dropdown,
    Menu,
    Select,
} from 'antd';
import { connect } from 'react-redux';
import {
    addColumn,
    removeColumn,
    updateData,
    setColumnType,
} from '../../store/action';
import { DataType } from '../../store/types';
import { ColumnProps } from 'antd/lib/table';
import {
    DeleteOutlined,
    EditOutlined,
    DownOutlined,
} from '@ant-design/icons';

interface TableComponentProps {
    columns: ColumnProps<DataType>[];
    data: DataType[];
    columnTypes: { [key: string]: 'string' | 'percent' };
    addColumn: (column: ColumnProps<DataType>) => void;
    removeColumn: (key: string) => void;
    updateData: (data: DataType[]) => void;
    setColumnType: (key: string, columnType: 'string' | 'percent') => void;
}

interface EditCell {
    recordKey: string;
    dataIndex: string;
    value: any;
}
//типизация проверить!!!
const TableComponent: React.FC<TableComponentProps> = ({
                                                           columns,
                                                           data,
                                                           columnTypes,
                                                           addColumn,
                                                           removeColumn,
                                                           updateData,
                                                           setColumnType,
                                                       }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [newColumnType, setNewColumnType] = useState<'string' | 'percent'>(
        'string'
    );
    const [editCell, setEditCell] = useState<EditCell | null>(null);
    const [isJsonModalVisible, setIsJsonModalVisible] = useState(false);
    const [jsonData, setJsonData] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (newColumnTitle) {
            const dataIndex = newColumnTitle.replace(/\s+/g, '');

            if (data.some((item) => item.hasOwnProperty(dataIndex))) {
                message.error('Колонка с таким названием уже существует, придумайте новое');
                return;
            }

            addColumn({
                title: newColumnTitle,
                dataIndex: dataIndex,
                key: dataIndex,
                render: (text, record) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{formatValue(text, dataIndex, newColumnType)}</span>
                        <EditOutlined
                            style={{ color: 'blue' }}
                            onClick={() => showEditModal(record.key, dataIndex, text)}
                        />
                    </div>
                ),
            });
            setColumnType(dataIndex, newColumnType);
            setNewColumnTitle('');
            setNewColumnType('string');
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewColumnTitle('');
        setNewColumnType('string');
    };

    const handleRemoveColumn = (key: string) => {
        removeColumn(key);
    };

    const showEditModal = (recordKey: string, dataIndex: string, value: any) => {
        setEditCell({ recordKey, dataIndex, value });
        setIsEditModalVisible(true);
    };

    const handleEditOk = () => {
        if (editCell) {
            const columnType = columnTypes[editCell.dataIndex];
            if (columnType === 'percent') {
                if (!isValidNumber(editCell.value)) {
                    message.error('Колонка имеет тип "percent", введите числовое значение!');
                    return;
                }
            }
            handleCellChange(editCell.recordKey, editCell.dataIndex, editCell.value);
        }
        setIsEditModalVisible(false);
        setEditCell(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditCell(null);
    };

    const handleCellChange = (
        recordKey: string,
        dataIndex: string,
        value: any
    ) => {
        const updatedData = data.map((item) =>
            item.key === recordKey && Object.keys(item).length > 1
                ? { ...item, [dataIndex]: value }
                : item
        );
        updateData(updatedData);
    };

    const handleColumnTypeChange = (
        key: string,
        columnType: 'string' | 'percent'
    ) => {
        setColumnType(key, columnType);
    };

    const formatValue = (
        value: any,
        dataIndex: string,
        columnType?: 'string' | 'percent'
    ) => {
        const typeToUse = columnType || columnTypes[dataIndex];
        if (typeToUse === 'percent') {
            const num = parseFloat(value);
            return isNaN(num) ? value : `${(num * 100).toFixed(2)}%`;
        }
        return value;
    };

    const isValidNumber = (value: any) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };

    const handleAddRow = () => {
        const newRow: DataType = { key: Date.now().toString() };
        columns.forEach((column) => {
            newRow[column.dataIndex] = '';
        });
        updateData([...data, newRow]);
    };

    const handleGenerateJson = () => {
        const json = JSON.stringify(data, null, 2);
        setJsonData(json);
        setIsJsonModalVisible(true);
    };

    const modifiedColumns = columns.map((col) => ({
        ...col,
        title: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <p>{col.title}</p>
                <div>
                    <Dropdown
                        overlay={
                            <Menu selectedKeys={[columnTypes[col.key as string]]}>
                                <Menu.Item
                                    key="string"
                                    onClick={() =>
                                        handleColumnTypeChange(col.key as string, 'string')
                                    }
                                >
                                    String
                                </Menu.Item>
                                <Menu.Item
                                    key="percent"
                                    onClick={() =>
                                        handleColumnTypeChange(col.key as string, 'percent')
                                    }
                                >
                                    Percent
                                </Menu.Item>
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        <DownOutlined style={{ marginLeft: 8 }} />
                    </Dropdown>
                    <DeleteOutlined
                        style={{ marginLeft: 8, color: 'red' }}
                        onClick={() => handleRemoveColumn(col.key as string)}
                    />
                </div>
            </div>
        ),
        render: (text: any, record: DataType) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{formatValue(text, col.dataIndex)}</span>
                <EditOutlined
                    style={{ color: 'blue' }}
                    onClick={() => showEditModal(record.key, col.dataIndex, text)}
                />
            </div>
        ),
    }));

    useEffect(() => {
        if (columns.length === 0) {
            updateData([]);
        }
    }, [columns, updateData]);

    return (
        <div>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Добавить колонку
            </Button>

            {columns.length > 0 && (
                <Button onClick={handleAddRow} style={{ marginBottom: 16 }}>
                    Добавить строку
                </Button>
            )}

            {data.length > 0 && (
                <Button onClick={handleGenerateJson} style={{ marginBottom: 16 }}>
                    Сгенерировать JSON
                </Button>
            )}

            <Modal
                title="Сгенерировать JSON"
                open={isJsonModalVisible}
                onOk={() => setIsJsonModalVisible(false)}
                onCancel={() => setIsJsonModalVisible(false)}
            >
                <pre>{jsonData}</pre>
            </Modal>

            <Modal
                title="Добавить новую колонку"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="Title">
                        <Input
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Type">
                        <Select
                            value={newColumnType}
                            onChange={(value: 'string' | 'percent') =>
                                setNewColumnType(value)
                            }
                        >
                            <Select.Option value="string">String</Select.Option>
                            <Select.Option value="percent">Percent</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Редактировать ячейку"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form layout="vertical">
                    <Form.Item>
                        <Input
                            value={editCell?.value}
                            onChange={(e) =>
                                setEditCell(
                                    editCell
                                        ? { ...editCell, value: e.target.value }
                                        : {
                                            recordKey: '',
                                            dataIndex: '',
                                            value: e.target.value,
                                        }
                                )
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                columns={modifiedColumns}
                dataSource={data}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    columns: state.columns,
    data: state.data,
    columnTypes: state.columnTypes,
});

const mapDispatchToProps = { //проверить
    addColumn,
    removeColumn,
    updateData,
    setColumnType,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableComponent);
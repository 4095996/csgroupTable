import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Dropdown,
    Select,
    MenuProps,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    DownOutlined,
} from '@ant-design/icons';
import {
    addColumn,
    removeColumn,
    updateData,
    setColumnType,
} from '../../store/action';
import {
    DataType, DispatchProps,
    EditCell,
    IModifiedColumns, OwnProps,
    RootState, StateProps,
} from '../../interfaces';
import {
    isValidNumber,
    generateJsonData,
    handleColumnTypeChange as handleColumnTypeChangeHelper,
    createNewRow, getModalTitle,
} from './helpers';

const mapStateToProps = (state: RootState): StateProps => ({
    columns: state.columns,
    data: state.data,
    columnTypes: state.columnTypes,
});

const mapDispatchToProps: DispatchProps = {
    addColumn,
    removeColumn,
    updateData,
    setColumnType,
};

const connector = connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & OwnProps;

type ModalType = 'addColumn' | 'editCell' | 'generateJson' | null;

const TableComponent: React.FC<Props> = ({
                                             columns,
                                             data,
                                             columnTypes,
                                             addColumn,
                                             removeColumn,
                                             updateData,
                                             setColumnType,
                                         }) => {
    const [modalType, setModalType] = useState<ModalType>(null);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [newColumnType, setNewColumnType] = useState<'string' | 'percent'>('string');
    const [editCell, setEditCell] = useState<EditCell | null>(null);
    const [jsonData, setJsonData] = useState('');

    const handleOk = () => {
        if (modalType === 'addColumn') {
            if (newColumnTitle) {
                const dataIndex = newColumnTitle.replace(/\s+/g, '');

                if (data.some((item) => Object.prototype.hasOwnProperty.call(item, dataIndex))) {
                    message.error('Колонка с таким названием уже существует, придумайте новое');
                    return;
                }

                const newColumn: IModifiedColumns = {
                    title: newColumnTitle,
                    dataIndex: dataIndex,
                    key: dataIndex,
                    render: (text, record) => (
                        <div className="columnHeader">
                            <span>{text}</span>
                            <EditOutlined
                                onClick={() => showEditModal(record.key, dataIndex, text)}
                            />
                        </div>
                    ),
                };
                addColumn(newColumn);
                setColumnType(dataIndex, newColumnType);
                setNewColumnTitle('');
                setNewColumnType('string');
            }
        } else if (modalType === 'editCell') {
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
        }
        setModalType(null);
    };

    const handleCancel = () => {
        setModalType(null);
        if (modalType === 'addColumn') {
            setNewColumnTitle('');
            setNewColumnType('string');
        } else if (modalType === 'editCell') {
            setEditCell(null);
        }
    };

    const handleRemoveColumn = (key: string) => {
        removeColumn(key);
    };

    const showEditModal = (
        recordKey: string,
        dataIndex: string | undefined,
        value: string | number
    ) => {
        if (typeof dataIndex === 'string') {
            setEditCell({ recordKey, dataIndex, value });
            setModalType('editCell');
        }
    };

    const handleCellChange = (
        recordKey: string,
        dataIndex: string,
        value: string | number
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
        handleColumnTypeChangeHelper(key, columnType, data, setColumnType);
    };

    const handleAddRow = () => {
        const newRow = createNewRow(columns);
        updateData([...data, newRow]);
    };

    const handleGenerateJson = () => {
        const json = generateJsonData(data);
        setJsonData(json);
        setModalType('generateJson');
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        const [columnKey, itemKey] = e.key.split('-');
        if (itemKey === 'string' || itemKey === 'percent') {
            handleColumnTypeChange(columnKey, itemKey as 'string' | 'percent');
        }
    };

    const modifiedColumns: IModifiedColumns[] = columns.map((col) => {
        const menuItems = [
            { key: `${col.key}-string`, label: 'String' },
            { key: `${col.key}-percent`, label: 'Percent' },
        ];

        return {
            ...col,
            title: (
                <div className="cell">
                    <p>{col.title}</p>
                    <div>
                        <Dropdown
                            menu={{
                                items: menuItems,
                                selectedKeys: [`${col.key}-${columnTypes[col.key]}`],
                                onClick: handleMenuClick,
                            }}
                            trigger={['click']}
                        >
                            <DownOutlined className="downOutlined" />
                        </Dropdown>
                        <DeleteOutlined
                            className="basket"
                            onClick={() => handleRemoveColumn(col.key)}
                        />
                    </div>
                </div>
            ),
            render: (text: string | number, record: DataType) => (
                <div className="cell">
                    <span className="cellValue">{text}</span>
                    <EditOutlined
                        onClick={() => showEditModal(record.key, col.dataIndex, text)}
                    />
                </div>
            ),
        };
    });

    useEffect(() => {
        if (columns.length === 0) {
            updateData([]);
        }
    }, [columns, updateData]);

    const renderModalContent = (modalType: ModalType) => {
        switch (modalType) {
            case 'addColumn':
                return (
                    <Form layout="vertical">
                        <Form.Item label="Название">
                            <Input
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="Тип (строка или процент">
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
                );
            case 'editCell':
                return (
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
                                                value: '',
                                            }
                                    )
                                }
                            />
                        </Form.Item>
                    </Form>
                );
            case 'generateJson':
                return <pre>{jsonData}</pre>;
            default:
                return null;
        }
    };

    return (
        <div className="tableCont">
            <Button type="primary" onClick={() => setModalType('addColumn')}>
                Добавить колонку
            </Button>
            {columns.length > 0 && <Button onClick={handleAddRow}>Добавить строку</Button>}
            {data.length > 0 && <Button onClick={handleGenerateJson}>Сгенерировать JSON</Button>}

            <Modal
                title={getModalTitle(modalType)}
                open={modalType !== null}
                onOk={handleOk}
                onCancel={handleCancel}
                className="modal"
            >
                {renderModalContent(modalType)}
            </Modal>
            <Table columns={modifiedColumns} dataSource={data} />
        </div>
    );
};

export default connector(TableComponent);
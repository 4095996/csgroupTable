import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import TableComponent from './components/Table/Table';

import './styles/index.scss';
import {Header} from "./components/Header";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Header />
            <TableComponent />
        </Provider>
    </React.StrictMode>
);
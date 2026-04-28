import {createHashRouter} from 'react-router-dom';
import {AppLayout} from '../layouts/AppLayout';
import {Connection} from '../pages/Connections/Connection';
import {Settings} from '../pages/Settings/Settings';
import {Workspace} from '../pages/Workspace/Workspace';

export const router = createHashRouter([
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            {
                index: true,
                element: <Connection/>,
            },
            {
                path: 'connections',
                element: <Connection/>,
            },
            {
                path: 'workspace/:connectionId',
                element: <Workspace/>,
            },
            {
                path: 'settings',
                element: <Settings/>,
            },
        ],
    },
]);

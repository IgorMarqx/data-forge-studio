import { createHashRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { Settings } from '../pages/Settings/Settings';
import { Workspace } from '../pages/Workspace/Workspace';
import { Root } from '../pages/Root/Root';

export const router = createHashRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Root />,
            },
            {
                path: 'Root',
                element: <Root />,
            },
            {
                path: 'workspace/:connectionId',
                element: <Workspace />,
            },
            {
                path: 'settings',
                element: <Settings />,
            },
        ],
    },
]);

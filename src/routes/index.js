// import AddNewPresentation from '../views/AddNewPresentation';
// import Login from '../views/auth/Login';
// import PresentationDetail from '../views/PresentationDetail';
// import Presentations from '../views/Presentations';
// import Logout from '../views/Logout';
import React, { Suspense, lazy } from 'react';

const Login = lazy(() => import('../views/auth/Login'));
const Logout = lazy(() => import('../views/Logout'));
const Presentations = lazy(() => import('../views/Presentations'));
const AddNewPresentation = lazy(() => import('../views/AddNewPresentation'));
const PresentationDetail = lazy(() => import('../views/PresentationDetail'));

let routes = [
	{
		path: '/auth/sign-in',
		component: Login,
		layout: 'auth',
	},
	{
		path: '/logout',
		component: Logout,
		layout: 'default',
	},
	{
		path: '/presentations',
		component: Presentations,
		layout: 'main',
	},
	{
		path: '/presentations/:mode/:id',
		component: AddNewPresentation,
		layout: 'main',
	},
	{
		path: '/presentations/:mode/:id',
		component: AddNewPresentation,
		layout: 'main',
	},
	{
		path: '/presentations/:id',
		component: PresentationDetail,
		layout: 'main',
	},
];
export default routes;

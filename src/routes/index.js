import AddNewPresentation from '../views/AddNewPresentation';
import Login from '../views/auth/Login';
import PresentationDetail from '../views/PresentationDetail';
import Presentations from '../views/Presentations';
import Loader from '../views/Loader';
import Logout from '../views/Logout';

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

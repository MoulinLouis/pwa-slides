import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Auth from './layout/Auth';
import Default from './layout/Default';
import Main from './layout/Main';
import routes from './routes';
import store from './store';
import { ToastContainer } from 'react-toastify';
import React, { Suspense, lazy } from 'react';

import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<>
			<Provider store={store}>
				<BrowserRouter>
					<Suspense fallback={<div>Loading...</div>}>

						<Switch>
							{routes.map(route => {
								switch (route.layout) {
									case 'main':
										return (
											<Route exact path={route.path}>
												<Main>
													<route.component />
												</Main>
											</Route>
										);
									case 'auth':
										return (
											<Route exact path={route.path}>
												<Auth>
													<route.component />
												</Auth>
											</Route>
										);
									case 'auth':
									default:
										return (
											<Route exact path={route.path}>
												<Default>
													<route.component />
												</Default>
											</Route>
										);
								}
							})}
							<Redirect to='/auth/sign-in' />
						</Switch>
					</Suspense>
				</BrowserRouter>
			</Provider>
			<ToastContainer />
		</>
	);
}

export default App;

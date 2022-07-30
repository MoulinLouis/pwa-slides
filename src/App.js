import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Auth from './layout/Auth';
import Default from './layout/Default';
import Main from './layout/Main';
import routes from './routes';
import store from './store';
import { ToastContainer } from 'react-toastify';
import React, { Suspense } from 'react';
import LoaderLazy from './components/LoaderLazy';

import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<>
			<Provider store={store}>
				<BrowserRouter>
					<Suspense fallback={<LoaderLazy/>}>

						<Switch>
							{routes.map((route, i) => {
								switch (route.layout) {
									case 'main':
										return (
											<Route exact path={route.path}>
												<Main>
													<route.component key={i}/>
												</Main>
											</Route>
										);
									case 'auth':
										return (
											<Route exact path={route.path}>
												<Auth>
													<route.component key={i}/>
												</Auth>
											</Route>
										);
									case 'default':
									default:
										return (
											<Route exact path={route.path}>
												<Default>
													<route.component key={i}/>
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

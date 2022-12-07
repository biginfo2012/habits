import React, { Fragment, lazy, Suspense, useState, useEffect } from 'react'
import { HashRouter as Router, Switch, Route, withRouter } from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Loader from 'pages/Loader';
import PublicRoute from 'routes/PublicRoute';
import ProtectedRoutes from 'routes/ProtectedRoutes';
import PrivateRoute from 'routes/PrivateRoute';

import { useLogin } from './contexts/ApplicationContext'
import ResetPassword from 'pages/habits/ResetPassword';

const LoginPage = lazy(() => import('./pages/habits/Signin'));
const ForgotPassword = lazy(() => import('./pages/habits/ForgotPassword'));
const NoFoundComponent = lazy(() => import('./pages/examples/NotFound'));

function App() {

    const { userInfo, setUserInfo } = useLogin();

    const [ isAuthenticated, setIsAuthenticated ] = useState(false);

    useEffect(() => {
        console.log("sono dentro qui")
        if( userInfo.token )
            setIsAuthenticated(true)
    }, [userInfo])

    return (
        <Fragment>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Router>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        <PublicRoute
                            path="/login"
                            isAuthenticated={isAuthenticated}
                        >
                            <LoginPage />
                        </PublicRoute>
                        <PublicRoute
                            path="/forgot-password"
                            isAuthenticated={isAuthenticated}
                        >
                            <ForgotPassword />
                        </PublicRoute>
                        <PublicRoute
                            path="/reset-password"
                            isAuthenticated={isAuthenticated}
                        >
                            <ResetPassword />
                        </PublicRoute>
                    
                        <PrivateRoute
                            path="/"
                            isAuthenticated={isAuthenticated}
                        >
                            <ProtectedRoutes />
                        </PrivateRoute>
                        <Route path="*">
                            <NoFoundComponent />
                        </Route>
                    </Switch>
                </Suspense>
            </Router>
        </Fragment>
    )
}

export default withRouter(App)
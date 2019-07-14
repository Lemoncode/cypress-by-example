import * as React from 'react';
import { LoginComponent } from './login.component';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { routesLinks, SessionContext } from 'core';
import {
    LoginEntityVm,
    createEmptyLogin,
    LoginFormErrors,
    createDefaultLoginFormErrors
} from './login.vm';
import { validateCredentials } from './api';
import { loginFormValidation } from './login.validation';

interface Props extends RouteComponentProps { }

const LoginContainerInner = (props: Props) => {
    const loginContext = React.useContext(SessionContext);
    const [loginFormErrors, setLoginFormErrors] = React.useState<LoginFormErrors>(createDefaultLoginFormErrors());
    const [credentials, setCredentials] = React.useState<LoginEntityVm>(createEmptyLogin());

    const { history } = props;

    const doLogin = () => {
        loginFormValidation.validateForm(credentials)
            .then((formValidationResult) => {
                if (formValidationResult.succeeded) {
                    validateCredentials(credentials.login, credentials.password)
                        .then((areValidCredentials) => {
                            if (areValidCredentials) {
                                loginContext.updateLogin(credentials.login);
                                history.push(routesLinks.hotelCollection);
                            } else {
                                alert('invalid credentials');
                            }
                        });
                } else {
                    alert('review fields');
                    setLoginFormErrors({
                        ...loginFormErrors,
                        ...formValidationResult.fieldErrors
                    })
                }
            });
    }

    const onUpdateCredentialsField = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value,
        });

        loginFormValidation.validateField(credentials, name, value)
            .then((fieldValidationResult) => {
                setLoginFormErrors({
                    ...loginFormErrors,
                    [name]: fieldValidationResult
                });
            });
    }

    return (
        <LoginComponent
            onLogin={doLogin}
            credentials={credentials}
            onUpdateCredentials={onUpdateCredentialsField}
            loginFormErrors={loginFormErrors}
        />
    )
}

export const LoginContainer = withRouter<Props, any>(LoginContainerInner);
import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from "@material-ui/core/CardContent";

import { LoginEntityVm, LoginFormErrors } from './login.vm';
import { LoginForm } from './login-form.component';

interface Props {
    onLogin: () => void;
    credentials: LoginEntityVm;
    onUpdateCredentials: (name: keyof LoginEntityVm, value: string) => void;
    loginFormErrors: LoginFormErrors;
}

export const LoginComponent = (props: Props) => {
    const {  onLogin, credentials, onUpdateCredentials, loginFormErrors } = props;
    
    return (
        <Card>
            <CardHeader title="Login" />
            <CardContent>
                <LoginForm 
                    credentials={credentials} 
                    onLogin={onLogin}
                    onUpdateCredentials={onUpdateCredentials}
                    loginFormErrors={loginFormErrors}
                />
            </CardContent>
        </Card>
    );
}
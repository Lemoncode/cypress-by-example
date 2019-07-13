import * as React from 'react';
import {
    Button,
    createStyles,
    WithStyles,
    withStyles
} from '@material-ui/core';
import { LoginEntityVm, LoginFormErrors } from './login.vm';
import { TextFieldForm } from 'common/components'

const styles = (theme) => createStyles({
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: '30rem'
    }
});

interface Props extends WithStyles<typeof styles> {
    credentials: LoginEntityVm;
    onUpdateCredentials: (name: keyof LoginEntityVm, value: string) => void;
    onLogin: () => void;
    loginFormErrors: LoginFormErrors;
}


const LoginFormInner = (props: Props) => {
    const { classes, credentials, onUpdateCredentials, onLogin, loginFormErrors } = props;

    return (
        <div className={classes.formContainer}>
            <TextFieldForm 
                label="Name"
                name="login"
                onChange={onUpdateCredentials}
                value={credentials.login}
                error={loginFormErrors.login.errorMessage} 
                focus={true}
                />
            <TextFieldForm 
                label="Password" 
                type="password"
                name="password"
                onChange={onUpdateCredentials}
                value={credentials.password} 
                error={loginFormErrors.password.errorMessage}
                />
            <Button onClick={onLogin} variant="contained" color="primary">
                Login
            </Button>
        </div>
    );
}

export const LoginForm = withStyles(styles)(LoginFormInner)

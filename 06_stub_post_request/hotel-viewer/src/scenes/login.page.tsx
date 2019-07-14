import * as React from 'react';
import { SingleViewLayout } from 'layout';
import { Link } from 'react-router-dom';
import { routesLinks } from 'core';
import { LoginContainer } from 'pods/login';

export const LoginPage = () => (
    <SingleViewLayout>
        <LoginContainer />
    </SingleViewLayout>
);
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NewReleases from '@material-ui/icons/NewReleases';
import { makeStyles } from '@material-ui/core/styles';
import { SessionContext } from 'core';
import { Link } from 'react-router-dom';

/*
a.nostyle:link {
    text-decoration: inherit;
    color: inherit;
    cursor: auto;
}

a.nostyle:visited {
    text-decoration: inherit;
    color: inherit;
    cursor: auto;
}
*/

const useStyles = makeStyles((theme) => ({
    nostyle: {
        textDecoration: 'inherit',
        color: 'inherit',
        cursor: 'auto',
        '&:hover': {
            textDecoration: 'inherit',
            color: 'inherit',
            cursor: 'auto',
        },
        '&:visited': {
            textDecoration: 'inherit',
            color: 'inherit',
            cursor: 'auto',
        }
    },
    aside: {
        marginLeft: 'auto',
    }
}));

export const AppLayout: React.FunctionComponent = (props) => {
    const loginContext = React.useContext(SessionContext);
    const classes = useStyles({});
    return (
        <div>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton color="inherit" aria-label="Menu">
                        <AccountCircle />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                        {loginContext.login}
                    </Typography>
                    <Link className={`${classes.nostyle} ${classes.aside}`}  to="/hotel-edit/new">
                        <IconButton  color="inherit" aria-label="Menu">
                            <NewReleases />
                        </IconButton>
                    </Link>
                    
                </Toolbar>
            </AppBar>
            {props.children}
        </div>
    );
}
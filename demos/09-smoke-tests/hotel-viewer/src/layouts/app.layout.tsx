import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { AccountCircle, Add } from '@mui/icons-material';
import { SessionContext } from 'core/session-context';
import { linkRoutes } from 'core/router';
import * as classes from './app.layout.styles';

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = (props) => {
  const { children } = props;
  const { login } = React.useContext(SessionContext);
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={() => navigate(linkRoutes.login)}
          >
            <AccountCircle />
          </IconButton>
          <Typography variant="h6" color="inherit">
            {login}
          </Typography>
          <IconButton
            style={{ marginLeft: 'auto' }}
            color="inherit"
            aria-label="Menu"
            onClick={() => navigate(linkRoutes.hotelEdit('0'))}
          >
            <Add />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>{children}</main>
    </>
  );
};

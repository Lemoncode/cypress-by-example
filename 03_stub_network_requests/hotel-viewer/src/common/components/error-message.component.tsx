import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    icon: {
        fontSize: 20,
        marginRight: 5
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

interface Props {
    errorMessage: string;
    open: boolean;
    onClose?: () => void;
}

export const ErrorMessageComponent = (props: Props) => {
    const classes = useStyles({});
    const { errorMessage, open, onClose } = props;
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
        >
            <SnackbarContent
                className={classes.error}
                message={
                    <span className={classes.message}>
                        <ErrorIcon className={classes.icon} />
                        {errorMessage}
                    </span>
                }
                action={[
                    <IconButton key="close" color="inherit" onClick={onClose}>
                        <CloseIcon className={classes.icon}/>
                    </IconButton>
                ]}
            />
        </Snackbar>
    );
}
import * as React from 'react';
import Card from '@material-ui/core/Card';
import { HotelEntityVm } from '../hotel-collection.vm';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar/Avatar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    CardContent,
    CardMedia,
    Typography,
    CardActions
} from '@material-ui/core';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { routesLinks } from 'core';

const styles = (theme: Theme) => createStyles({
    card: {
        width: '500px',
        marginTop: '10px',
    }
})

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    hotel: HotelEntityVm;
}

const HotelCardInner = (props: Props) => {
    const { hotel, classes, history } = props;

    const navigateToHotelEdit = (id) => () => { 
        history.push(routesLinks.hotelEdit(id));
    };

    return (
        <Card className={classes.card}>
          <CardHeader 
          avatar={
              <Avatar aria-label="Hotel">
                  { hotel.rating }
              </Avatar>
          }
          action={
              <IconButton>
                  <MoreVertIcon />
              </IconButton>
          }
          title={hotel.name}
          subheader={hotel.address} 
          />  
          <CardContent>
              <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
              }}>
                  <CardMedia
                    image={hotel.picture}
                    title={hotel.name}
                    style={{ height: 0, paddingTop: '56.25%' }} 
                  />
                  <Typography variant="subtitle1" gutterBottom>
                      {hotel.description}
                  </Typography>
              </div>
          </CardContent>
          <CardActions disableSpacing>
              <IconButton onClick={navigateToHotelEdit(hotel.id)} aria-label="Add to favorites">
                  <EditIcon />
              </IconButton>
              <IconButton aria-label="Share">
                  <DeleteIcon />
              </IconButton>
          </CardActions>
        </Card>
    );
}

export const HotelCard = (withStyles(styles)(withRouter<Props, any>(HotelCardInner)));
import * as React from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    }
}));

interface Props {
    value: string; 
    values: string[];
    onChange: (selectedValue: string) => void;
    label: string;
    name?:string;
}

export const SelectFieldFormComponent = (props: Props) => {
    const classes = useStyles({});
    return (
        <FormControl className={classes.formControl}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={props.value}
                inputProps={
                    (props.name) ? { name: props.name } : null
                }
                onChange={(e) => props.onChange(e.target.value as string)}
            >
                {
                    props.values.map((value) =>
                        <MenuItem key={value} value={value}>{value}</MenuItem> 
                    )
                }
            </Select>
        </FormControl>
    );
}
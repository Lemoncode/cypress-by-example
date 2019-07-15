import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography/Typography';

interface Props {
  name: string;
  label: string;
  onChange: (field: string, value) => void;
  value: string;
  error?: string;
  type?: string;
  onBlur?: (field: string, value) => void;
  focus?: boolean;
  style?: any;
  multiline?: boolean;
  rows?: number;
}

const handleChange = (field: string, onChange) => e => {
  onChange(field, e.target.value);
};

const handleBlur = (field: string, onBlur) => e => {
  if (onBlur) {
    onBlur(field, e.target.value);
  }
};

export const TextFieldForm: React.StatelessComponent<Props> = ({
  name,
  label,
  onChange,
  value,
  error,
  type,
  onBlur,
  focus,
  style,
  multiline,
  rows,
}) => (
  <>
    <TextField
      label={label}
      margin="normal"
      value={value}
      type={type}
      onChange={handleChange(name, onChange)}
      onBlur={handleBlur(name, onBlur)}
      autoFocus={focus}
      multiline={multiline}
      rows={rows}
      style={style}
    />
    <Typography variant="caption" color="error" gutterBottom={true}>
      {error}
    </Typography>
  </>
);

TextFieldForm.defaultProps = {
  type: 'text',
};
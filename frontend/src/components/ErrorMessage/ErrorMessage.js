import React from 'react';
import Alert from '@material-ui/lab/Alert';

const ErrorMessage = ({ severity = 'info', children }) => {
  return (
    <Alert severity={severity} style={{ fontSize: 15 }}>
        <strong>{children}</strong>
    </Alert>
  )
}

export default ErrorMessage;

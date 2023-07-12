import * as React from 'react'
import { Alert, AlertTitle } from '@mui/material'

export function isDefinitelyAnError(error: unknown): error is Error {
  return error instanceof Error
}

export function Error({ errorMessage }) {
  return (
    <Alert severity='error' style={{ width: 300, margin: 'auto' }}>
      <AlertTitle>Error</AlertTitle>
      {errorMessage}
    </Alert>
  )
}

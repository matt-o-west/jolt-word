import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import ErrorIcon from '@mui/icons-material/Error'
import { red } from '@mui/material/colors'

export function isDefinitelyAnError(error: unknown): error is Error {
  return error instanceof Error
}

export function Error({ errorMessage }) {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='flex-end'
      sx={{ minWidth: 275 }}
    >
      <Card variant='outlined' sx={{ bgcolor: red[50] }}>
        <CardContent>
          <Box display='flex' alignItems='center'>
            <ErrorIcon sx={{ color: red[500] }} />
            <Typography
              variant='h5'
              component='div'
              sx={{ color: red[500], marginLeft: 1, textAlign: 'right' }}
            >
              Uh oh...
            </Typography>
          </Box>
          <Typography variant='body2' sx={{ color: red[700] }}>
            Something went wrong.
          </Typography>
          <Typography variant='body2' sx={{ color: red[700] }}>
            {errorMessage}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

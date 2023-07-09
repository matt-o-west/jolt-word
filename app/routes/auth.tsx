import React from 'react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { db } from 'prisma/db.server'
import { OAuth2Client } from 'google-auth-library'

export interface GoogleUser {
  id: string
  email: string
  email_verified?: boolean
  given_name?: string
  family_name?: string
  picture?: string
}

export const action = async ({ request }: ActionArgs) => {
  let user: GoogleUser | undefined = undefined
}

const Auth = () => {
  return null
}

export default Auth

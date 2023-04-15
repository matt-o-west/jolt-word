import { Password } from '@mui/icons-material'
import bcrypt from 'bcryptjs'

import { db } from 'prisma/db.server'

type LoginForm = {
  username: string
  password: string
}

export const login = async ({ username, password }: LoginForm) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  })
  if (!user) {
    return null
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return null
  }

  return { id: user.id, username: user.username }
}

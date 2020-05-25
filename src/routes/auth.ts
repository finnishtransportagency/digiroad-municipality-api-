import { Router, Request, Response } from 'express'
import Amplify, { Auth } from 'aws-amplify'
import { validateLogin, validateChangePassword } from '../libs/userValidator'
import { validateForgotPassword } from '../libs/userValidator'

// https://stackoverflow.com/questions/48433783/referenceerror-fetch-is-not-defined
import Global = NodeJS.Global
export interface GlobalWithCognitoFix extends Global {
  fetch: any
}
declare const global: GlobalWithCognitoFix
global.fetch = require('node-fetch')

Amplify.configure({
  Auth: {
    region: process.env.USER_POOL_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_CLIENT_ID,
  },
})

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body)
  if (error) return res.status(403).send(error)

  const { username, password, newPassword } = req.body

  let user
  try {
    user = await Auth.signIn({ username, password })
  } catch (exeption) {
    console.error(exeption)
    return res.status(403).send({ message: 'Invalid username or password' })
  }

  if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
    if (!newPassword) {
      return res.status(403).send({
        message: `
          New password required when login for the first time.
          Password must be at lest 8 characters long and contain numbers, upper and lower case letters`,
        fields: {
          username: 'required',
          password: 'required',
          newPassword: 'required',
        },
      })
    }
    try {
      // @ts-ignore
      user = await Auth.completeNewPassword(user, newPassword)
    } catch (exeption) {
      return res.status(400).send(exeption)
    }
  }

  return res.status(200).send({
    instructions:
      'Put provided token to Authorization header which enabels to make HTTP requests to other endpoints.',
    token: user.signInUserSession.idToken.jwtToken,
  })
})

router.post('/changepassword', async (req: Request, res: Response) => {
  const { error } = validateChangePassword(req.body)
  if (error) return res.status(403).send(error)

  const { username, oldPassword, newPassword } = req.body

  try {
    const user = await Auth.signIn({ username, password: oldPassword })
    await Auth.changePassword(user, oldPassword, newPassword)
    return res.status(200).send({ SUCCESS: 'password changed successfully' })
  } catch (exeption) {
    return res.status(400).send(exeption)
  }
})

router.post('/forgotpassword', async (req: Request, res: Response) => {
  const { error } = validateForgotPassword(req.body)
  if (error) return res.status(403).send(error)

  const { username, code, newPassword } = req.body
  try {
    if (!code) {
      const result = await Auth.forgotPassword(username)
      return res.status(200).send({ message: result })
    } else {
      await Auth.forgotPasswordSubmit(username, code, newPassword)
      return res.status(202).send()
    }
  } catch (exeption) {
    return res.status(403).send(exeption)
  }
})

export default router

import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'
import { verify } from 'jsonwebtoken'
import jwkToPem, { JWK } from 'jwk-to-pem'

const iss = `https://cognito-idp.${process.env.USER_POOL_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`

const AUTH_OFF = process.env.AUTH_OFF || false

if (AUTH_OFF === 'off' && process.env.NODE_ENV !== 'test') {
  console.log('Authentication is turned off')
}

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  if (AUTH_OFF === 'off') {
    req.user = { sub: '7F70ACD8-9A18-4553-ADE0-16EBCD8A3207' }
    return next()
  }

  const { authorization } = req.headers
  if (!authorization) {
    return res.status(403).send({
      message: `Please provide JSON Web Token to 'Authorization' header`,
    })
  }

  fetch(`${iss}/.well-known/jwks.json`)
    .then((result) => result.json())
    .then((codes) => {
      const pem = jwkToPem({ ...(codes.keys[0] as JWK) })
      try {
        const decoded = verify(authorization as string, pem, { issuer: iss })
        req.user = decoded as User
        next()
      } catch {
        return res.status(403).send({ message: 'Invalid JSON Web Token' })
      }
    })
}

export default middleware

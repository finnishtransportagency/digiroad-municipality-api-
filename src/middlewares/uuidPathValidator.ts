import { NextFunction, Request, Response } from 'express'
import uuidValidator from '../libs/uuidValidator'

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const isValid = uuidValidator(id)
  if (!isValid) return res.status(400).send({ message: 'invalid UUID' })
  next()
}

export default middleware

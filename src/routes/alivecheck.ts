import { Router, Response } from 'express'

const router = Router()

router.get('/', async (_, res: Response) => {
  res.send({ message: 'Success!' })
})

export default router

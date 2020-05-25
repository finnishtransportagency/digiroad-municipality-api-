import express, { Application } from 'express'
import alivecheck from './alivecheck'
import datasets from './datasets'
import auth from './auth'

export const routes = (app: Application) => {
  app.use(express.json())
  app.use('/alivecheck', alivecheck)
  app.use('/dataset', datasets)
  app.use('/', auth)
}

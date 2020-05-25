import { Router, Request, Response } from 'express'
import {
  getDatasetsByUserId,
  getDatasetById,
  deleteDatasetById,
  createDataset,
  setUpdateExecuted,
  updateJsonData,
} from '../datasources/datasets'
import { matchGeoJSON } from '../services/assetMatcherService'
import auth from '../middlewares/auth'
import uuid from '../middlewares/uuidPathValidator'

const router = Router()

router.post('/', [auth], async (req: Request, res: Response) => {
  const userId = req.user.sub
  const geojson = req.body
  const dataset_id = await createDataset(userId, geojson)

  matchGeoJSON(geojson).then((features) => {
    geojson.features = features
    updateJsonData(dataset_id, geojson)
  })

  res.status(201).send({
    dataset_id,
    result: { message: 'dataset saved successfully' },
  })
})

router.get('/:id', [uuid, auth], async (req: Request, res: Response) => {
  const { id } = req.params

  const includeGeojson = req.query.geojson === 'yes'
  const userId = req.user.sub
  const dataset = await getDatasetById(id, includeGeojson)

  if (!dataset) return res.status(404).send()

  if (userId.toLowerCase() !== dataset['user_id'].toLowerCase()) {
    return res.status(403).send()
  }

  delete dataset['user_id']
  return res.send({ dataset })
})

router.put('/:id/upload', [uuid, auth], async (req: Request, res: Response) => {
  const { id } = req.params

  const userId = req.user.sub
  const dataset = await getDatasetById(id)

  if (!dataset) return res.status(404).send()
  if (userId.toLowerCase() !== dataset['user_id'].toLowerCase()) {
    return res.status(403).send()
  }

  const updated = await setUpdateExecuted(dataset.dataset_id as string)

  return res.status(202).send({
    message:
      'Success: Upload method is not fully implemented. In future this method will upload data to Digiroad.',
    updated,
  })
})

router.delete('/:id', [uuid, auth], async (req: Request, res: Response) => {
  const { id } = req.params

  const userId = req.user.sub
  const dataset = await getDatasetById(id)

  if (!dataset) return res.status(404).send()
  if (userId.toLowerCase() !== dataset['user_id'].toLowerCase()) {
    return res.status(403).send()
  }

  deleteDatasetById(id)

  return res.status(202).send()
})

router.get('/', [auth], async (req: Request, res: Response) => {
  const datasets = await getDatasetsByUserId(req.user.sub)
  res.send({ datasets })
})

export default router

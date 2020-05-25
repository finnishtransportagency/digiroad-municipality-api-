import app from '../index'
import supertest from 'supertest'

const api = supertest(app)
import fs from 'fs'
let jsonData = JSON.parse(
  fs.readFileSync(__dirname + '/testdata/test.json', 'utf-8')
)

describe('Datasets CRUD tests', () => {
  it('GET /dataset', async () => {
    await api.get('/dataset').expect(200)
  })

  let uuid: string
  it('POST /dataset', async () => {
    const result = await api.post('/dataset').send(jsonData).expect(201)

    expect(result.body).toEqual(
      expect.objectContaining({
        dataset_id: expect.any(String),
        result: expect.objectContaining({
          message: expect.any(String),
        }),
      })
    )
    uuid = result.body.dataset_id
  })

  it('GET /dataset/:id', async () => {
    const result = await api.get(`/dataset/${uuid}`).expect(200)

    expect(result.body.dataset).toEqual(
      expect.objectContaining({
        dataset_id: expect.any(String),
      })
    )
  })

  it('GET /dataset/:id?geojson=yes', async () => {
    const result = await api.get(`/dataset/${uuid}?geojson=yes`).expect(200)

    expect(result.body.dataset.json_data).toEqual(jsonData)
  })

  it('PUT /dataset/:id/upload', async () => {
    await api.put(`/dataset/${uuid}/upload`).expect(202)
  })

  it('DELETE /dataset/:id', async () => {
    await api.delete(`/dataset/${uuid}`).expect(202)
    await api.get(`/dataset/${uuid}`).expect(404)
  })
})

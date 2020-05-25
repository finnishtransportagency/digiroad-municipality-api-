const MATCHER_URL = process.env.ASSET_MATCHER_URL || 'http://localhost:3000'
import fetch from 'node-fetch'

export const matchGeoJSON = (GeoJSON: any) => {
  const promises = GeoJSON.features.map((Feature: any) => {
    return new Promise((resolve, reject) => {
      fetch(MATCHER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Feature),
      })
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err))
    })
  })

  return Promise.all(promises)
}

module.exports = { matchGeoJSON }

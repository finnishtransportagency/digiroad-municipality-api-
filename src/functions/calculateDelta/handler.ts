import { middyfy } from '@libs/lambda';
import * as aws from "aws-sdk";

const calculateDelta = async (event) => {
  
  const s3 = new aws.S3();

  const key: string = decodeURIComponent(event.Records[0].s3.object.key)

  const municipality: string = key.split('/')[0];

  try {
    const params = {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Prefix: municipality
    }

    var keys = await s3.listObjectsV2(params).promise()
    const sortedKeyList = keys.Contents.sort(k => -k.LastModified.getTime())
    var updateKey = sortedKeyList[0].Key;
    var refrenceKey = sortedKeyList[1].Key;

  } catch (e) {
    throw new Error(`Could not list object keys from S3: ${e.message}`)
  }
  
  async function getObject (bucket, objectKey) {
    try {
      const params = {
        Bucket: bucket,
        Key: objectKey 
      }
  
      const data = await s3.getObject(params).promise();
  
      return data.Body.toString('utf-8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
  }
  
  const updateObject = JSON.parse(await getObject(`dr-kunta-${process.env.STAGE_NAME}-bucket`, updateKey)).features;
  const refrenceObject = JSON.parse(await getObject(`dr-kunta-${process.env.STAGE_NAME}-bucket`, refrenceKey)).features;
 
  const created = [];
  const deleted = [];
  const updated = [];

  function comparePoints(obj1, obj2){
    if(obj1.properties.EST_TYYPPI !== obj2.properties.EST_TYYPPI){
      return true;
    }
    if(obj1.geometry.coordinates[0] !== obj2.geometry.coordinates[0] ||
       obj1.geometry.coordinates[1] !== obj2.geometry.coordinates[1]){
        return true
       }
    return false
  }

  for(let i = 0; i < updateObject.length; i++){
    var found = false;
    for(let j = 0; j < refrenceObject.length; j++){
      if(updateObject[i].properties.ID === refrenceObject[j].properties.ID){
        if(comparePoints(updateObject[i], refrenceObject[j])){
          updated.push(updateObject[i])
        }
        found = true;
        break;
      }
    }
    if(!found){
      created.push(updateObject[i])
    }
  }
  for(let j = 0; j < refrenceObject.length; j++){
    var found = false;
    for(let i = 0; i < updateObject.length; i++){ 
      if(updateObject[i].properties.ID === refrenceObject[j].properties.ID){
        found = true
        break;
      }
      
    }
    if(!found){
      deleted.push(updateObject[j])
    }
  }
  console.log(`Created: ${JSON.stringify(created)}`)
  console.log(`Deleted: ${JSON.stringify(deleted)}`)
  console.log(`Updated: ${JSON.stringify(updated)}`)


};

export const main = middyfy(calculateDelta);
/**
 * The type of the event that triggers the fetchMunicipalityData function.
 */
interface ScheduleEvent {
  url: string;
  format: 'xml';
  municipality: string;
  assetTypes: {
    obstacles?: 'infrao:Rakenne';
    trafficSigns?: 'infrao:Liikennemerkki';
    roadSurfaces?: 'infrao:KatuAlueenOsa';
  };
}

export const isScheduleEvent = (event: unknown): event is ScheduleEvent => {
  if (typeof event !== 'object' || event === null) {
    return false;
  }

  const { url, format, municipality, assetTypes } = event as ScheduleEvent;

  if (
    typeof url !== 'string' ||
    format !== 'xml' ||
    typeof municipality !== 'string' ||
    typeof assetTypes !== 'object' ||
    assetTypes === null ||
    (assetTypes.obstacles !== undefined &&
      assetTypes.obstacles !== 'infrao:Rakenne') ||
    (assetTypes.trafficSigns !== undefined &&
      assetTypes.trafficSigns !== 'infrao:Liikennemerkki') ||
    (assetTypes.roadSurfaces !== undefined &&
      assetTypes.roadSurfaces !== 'infrao:KatuAlueenOsa')
  ) {
    return false;
  }

  return true;
};

interface xmlFeatureCollectionJson {
  'sf:FeatureCollection': {
    'sf:featureMember': Array<object>;
  };
}

export const isXmlFeatureCollectionJson = (
  json: unknown
): json is xmlFeatureCollectionJson => {
  if (typeof json !== 'object' || json === null) {
    return false;
  }

  const { 'sf:FeatureCollection': featureCollection } =
    json as xmlFeatureCollectionJson;

  if (
    typeof featureCollection !== 'object' ||
    featureCollection === null ||
    !Array.isArray(featureCollection['sf:featureMember']) ||
    featureCollection['sf:featureMember'].some(
      (featureMember) =>
        typeof featureMember !== 'object' || featureMember === null
    )
  ) {
    return false;
  }

  return true;
};

import { DrKuntaFeature, LinkObject } from '@functions/typing';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate';
import BufferOP from 'jsts/org/locationtech/jts/operation/buffer/BufferOp';
import OverlayOp from 'jsts/org/locationtech/jts/operation/overlay/OverlayOp';

export default function (
  roadLinks: Array<LinkObject>,
  feature: DrKuntaFeature,
  geomFactory: jsts.org.locationtech.jts.geom.GeometryFactory
) {
  const validLinks = [];
  const reader = new GeoJSONReader();
  const complexGeometry = reader.read(feature.geometry);
  const featureGeometry = BufferOP.bufferOp(complexGeometry, 0);
  for (const roadlink of roadLinks) {
    const points = roadlink.points;
    const coordinates: Array<jsts.org.locationtech.jts.geom.Coordinate> = [];
    for (let j = 0; j < points.length; j++) {
      const point = points[j];
      coordinates[j] = new Coordinate(point.x, point.y, point.z);
    }
    const lineString = geomFactory.createLineString(coordinates);
    const intersected = OverlayOp.intersection(featureGeometry, lineString);
    const intersectedLength = intersected.getLength();
    const roadlinkLength = lineString.getLength();
    const ratio = intersectedLength / roadlinkLength;
    if (ratio > 0.7) {
      validLinks.push({
        linkid: roadlink.linkId,
        length: roadlink.geometrylength
      });
    }
  }
  const result = {
    DR_VALIDLINKS: validLinks,
    DR_REJECTED: validLinks.length === 0
  };
  return result;
}

import { DrKuntaFeature, LinkObject } from '@functions/typing';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import { Coordinate } from 'jsts/org/locationtech/jts/geom';
import BufferOP from 'jsts/org/locationtech/jts/operation/buffer/BufferOp';
import OverlayOp from 'jsts/org/locationtech/jts/operation/overlay/OverlayOp';
import { createLineString } from '@libs/spatial-tools';

export default function (roadLinks: Array<LinkObject>, feature: DrKuntaFeature) {
  const validLinks = [];
  const reader = new GeoJSONReader();
  const complexGeometry = reader.read(feature.geometry);
  const featureGeometry = BufferOP.bufferOp(complexGeometry, 0);
  for (const roadlink of roadLinks) {
    const coordinates: Array<Coordinate> = roadlink.points.map(
      (point) => new Coordinate(point.x, point.y, point.z)
    );

    const lineString = createLineString(coordinates);
    const intersected = OverlayOp.intersection(featureGeometry, lineString);
    const intersectedLength = intersected.getLength();
    const roadlinkLength = lineString.getLength();
    const ratio = intersectedLength / roadlinkLength;
    if (ratio > 0.5) {
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

export default function (features, additionalPanels) {
  const rejectedAdditionalPanels = [];
  for (const additionalPanel of additionalPanels) {
    const match = {
      feature: undefined,
      distance: Number.MAX_VALUE
    };
    for (const trafficSign of features) {
      const dx =
        additionalPanel.geometry.coordinates[0] -
        trafficSign.geometry.coordinates[0];
      const dy =
        additionalPanel.geometry.coordinates[1] -
        trafficSign.geometry.coordinates[1];

      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 5 && distance < match.distance) {
        match.distance = distance;
        match.feature = trafficSign;
      }
    }
    if (match.feature) {
      console.log(additionalPanel);
      match.feature.properties.LISAKILVET.push(additionalPanel.properties);
    } else {
      rejectedAdditionalPanels.push(additionalPanel.properties.ID);
    }
  }
  return rejectedAdditionalPanels;
}

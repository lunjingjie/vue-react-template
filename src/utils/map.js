import L from 'leaflet';
import * as hotp from 'leaflet-hotline/dist/leaflet.hotline';

export const renderHotline = (mapInstance, data, options = {}) => {
  const hotline = hotp(L).hotline(data, options);
  const bounds = hotline.getBounds();
  mapInstance.fitBounds(bounds);
  hotline.addTo(mapInstance);
};

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 创建地图
const initMap = (id, options) => {
  const map = L.map(id, options);
  return map;
};

// 添加图层
const addTileLayer = (url, options) => {
  let tileLayer = L.tileLayer(url, options);
  // tileLayer.addTo(map);
  return tileLayer;
};

const addToLayer = (map, layer) => {
  layer.addTo(map);
  return map;
};

const addLayer = (map, layer) => {
  map.addLayer(layer);
  return map;
};

// 清除图层-单个清除
const removeLayer = (map, tilelayer) => {
  map.removeLayer(tilelayer);
};

const addLayerWMS = (url, options) => {
  let layerWms = L.tileLayer.wms(url, options);
  // layerWms.addTo(map);
  return layerWms;
};

// 新增一个地图缩放控件
const addZoom = (map, options) => {
  const zoomControl = L.control.zoom(options);
  map.addControl(zoomControl);
  return map;
};

// 创建标记的图标
const createIcon = (options) => {
  const iconData = L.icon(options);
  return iconData;
};

const createDivIcon = (options) => {
  return L.divIcon(options);
};

// 标记
const createMarker = (coor, options) => {
  return L.marker(coor, options);
};

// 将图层添加进组
const createLayerGroup = (layers) => {
  return L.layerGroup(layers);
};

// 绘制多边形
const createPolygon = (map, latlngs, options) => {
  const polygon = L.polygon(latlngs, options);
  polygon.addTo(map);
  return polygon;
};
export default {
  initMap,
  addTileLayer,
  addToLayer,
  addLayer,
  removeLayer,
  addLayerWMS,
  addZoom,
  createIcon,
  createDivIcon,
  createMarker,
  createLayerGroup,
  createPolygon,
};

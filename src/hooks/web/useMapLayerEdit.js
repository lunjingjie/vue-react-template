import L from 'leaflet';
import 'leaflet-editable/src/Leaflet.Editable';
import { useDebounceFn } from '@vueuse/core';

export const useMapLayerEdit = (map, polyline, completeCb) => {
  const tooltip = L.DomUtil.get('tooltip');
  function addTooltip() {
    tooltip.innerHTML = '点击地图开始绘制线段';
    tooltip.style.display = 'block';
  }

  function removeTooltip(e) {
    tooltip.innerHTML = '';
    tooltip.style.display = 'none';
    completeCb(e);
  }

  function updateTooltip(e) {
    if (e.layer.editor._drawnLatLngs.length < e.layer.editor.MIN_VERTEX) {
      tooltip.innerHTML = '点击地图继续绘制';
    } else {
      tooltip.innerHTML = '点击最后一个点结束绘制';
    }
    completeCb(e);
  }

  if (polyline) {
    polyline.enableEdit();
    map.fitBounds(polyline.getBounds());
    map.on('editable:created', completeCb);
    map.on('editable:editing', useDebounceFn(completeCb, 500));
    // 初始化保存坐标集合
    completeCb(null);
  } else {
    map.on('editable:drawing:start', addTooltip);
    map.on('editable:drawing:end', removeTooltip);
    map.on('editable:drawing:click', updateTooltip);
  }
};

export const initEditControl = (map) => {
  L.NewLineControl = L.Control.extend({
    options: {
      position: 'topleft',
    },

    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
        link = L.DomUtil.create('a', '', container);

      link.href = '#';
      link.title = '绘制河涌';
      link.innerHTML = '/\\/';
      L.DomEvent.on(link, 'click', L.DomEvent.stop).on(link, 'click', function () {
        map.editTools.startPolyline();
      });

      return container;
    },
  });

  map.addControl(new L.NewLineControl());
};

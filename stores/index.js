// pinia集合模块，根据业务要求判断是否使用
import useCollapsedStore from '@/stores/collapsed';
import useLayoutStore from '@/stores/layout';
import useLoginStore from '@/stores/login';
import useMultipleTabStore from '@/stores/multipleTab';
import useMenuStore from '@/stores/menu';
import useStationStore from '@/stores/station';

export default function useStore() {
  return {
    collapsed: useCollapsedStore(),
    layout: useLayoutStore(),
    login: useLoginStore(),
    multipleTab: useMultipleTabStore(),
    menu: useMenuStore(),
    station: useStationStore(),
  };
}

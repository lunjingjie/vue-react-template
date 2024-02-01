import { getAllDictListData } from '@/api/systemSetting/systemManage/dict';
import { arraySort } from '../../utils';

export const useDict = async (type) => {
  const { data } = await getAllDictListData(type);
  const options = arraySort(
    data.data.records.map((item) => ({
      label: item.dictLabel,
      value: item.dictValue,
      sort: item.dictSort,
    })),
    'sort',
    'asc',
  );
  return options;
};

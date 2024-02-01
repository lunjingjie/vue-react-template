import { useRouter } from 'vue-router';
import { pageConstant } from '../../constants/pageConstant';
import { isString } from '@/utils/is';

function handleError(e) {
  console.error(e);
}

export const useGo = (_router) => {
  let router = null;
  if (!_router) {
    router = useRouter();
  }
  const { push, replace } = router || _router;
  const go = (opt = pageConstant.BASE_HOME, isReplace = false) => {
    if (!opt) {
      return;
    }
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
    } else {
      const o = opt;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  };
  return go;
};

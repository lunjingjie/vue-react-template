import { RouterProvider } from 'react-router-dom';
import { router } from '../../../util/router';
// import NProgress from 'nprogress';
// import 'nprogress/nprogress.css';
import './index.scss';
// import { useEffect } from 'react';

export const ProgressRouter = () => {
  // useEffect(() => {
  //   console.log('test');
  //   NProgress.start();
  //   return () => {
  //     NProgress.done(true);
  //   }
  // });

  return <RouterProvider router={router}></RouterProvider>;
};

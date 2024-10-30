// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import Loading from '../components/loading/Loading';

const Home = lazy(() => import('../components/Home'));
const NotFound = lazy(() => import('../components/error/NotFound'));


function AppRoutes() {

  return (
    <Suspense fallback={<Loading/>}>
      <Routes>
        <Route 
          path={ROUTES.HOME} 
          element={<Home />} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
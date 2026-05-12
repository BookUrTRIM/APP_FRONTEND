import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const API_URL = 'https://bookish-space-carnival-q7v6qgr474j5cgjj-8000.app.github.dev';
  const token = localStorage.getItem('access_token');

  const apiReq = req.clone({
    url: `${API_URL}${req.url}`,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
  });

  return next(apiReq);
};

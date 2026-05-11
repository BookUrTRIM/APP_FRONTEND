import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const API_URL = 'http://localhost:8000';
  const token = localStorage.getItem('access_token');

  const apiReq = req.clone({
    url: `${API_URL}${req.url}`,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
  });

  return next(apiReq);
};

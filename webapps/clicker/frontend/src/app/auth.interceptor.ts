import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const authToken = authService.getToken();

    // Clone the request and add the authorization header if the token exists
    if (authToken) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return next(authReq);
    }

    // If no token, pass the original request along
    return next(req);
};
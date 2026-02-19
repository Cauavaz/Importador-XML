import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { UploadComponent } from './pages/upload/upload';
import { NotasEntradaComponent } from './pages/notas-entrada/notas-entrada';
import { NfeDetailsComponent } from './pages/nfe-details/nfe-details';
import { authGuard } from './guards/auth.guard';
    
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'dashboard',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'upload',
                pathMatch: 'full'
            },
            {
                path: 'upload',
                component: UploadComponent
            },
            {
                path: 'notas-entrada',
                component: NotasEntradaComponent,
                pathMatch: 'full'
            },
            {
                path: 'notas-entrada/detalhe/:id',
                component: NfeDetailsComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];

import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { AuthService } from './auth/services/auth.service';
import { catchError, filter, firstValueFrom, of, switchMap } from 'rxjs';

const redirectToLogin = () => redirectUnauthorizedTo([''])

/**
 * Guard to check if the user is admin approved in the firestore DB
 * @returns true if he is admin approved false otherwise
 */
const AuthGuardWithAdminApproval = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const userInDb$ = auth.user$.pipe(
    filter(user => user !== null),
    switchMap(user => auth.isUserAuthorizedInDatabase$(user.uid)),
    catchError((error) => {
      alert(`${error}`);
      router.navigate(['/profile']);
      return of(false);
    })
  );

  return await firstValueFrom(userInDb$); // Résolution de l'observable pour retourner un résultat synchrone
};


const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import("./core/core-routing.module").then(m => m.CoreRoutingModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'training',
    loadChildren: () => import('./training/training-routing.module').then(m => m.TrainingRoutingModule),
    canActivate: [AngularFireAuthGuard, AuthGuardWithAdminApproval],
    data: { authGuardPipe: redirectToLogin }
  },
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

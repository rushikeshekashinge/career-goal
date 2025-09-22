import { Routes } from '@angular/router';
import { UserlistComponent } from './userlist/userlist.component';

export const routes: Routes = [
    {
      path: '', 
      redirectTo: 'users',
      pathMatch: 'full'
    },
    {
      path: 'users',
      component:  UserlistComponent
    },
  ];

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './pages/setup/setup.component';


const routes: Routes = [
  { path: 'setup', component: SetupComponent },
  { path: 'board', redirectTo: '/board', pathMatch: 'full' },
  { path: '', redirectTo: '/board', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

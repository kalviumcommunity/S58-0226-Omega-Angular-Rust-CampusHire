import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { JobsListComponent } from './components/jobs-list.component';
import { StudentDashboardComponent } from './components/student-dashboard.component';
import { ApplicationFormComponent } from './components/application-form.component';
import { StudentProfileComponent } from './components/student-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'jobs', component: JobsListComponent },
  { path: 'dashboard', component: StudentDashboardComponent },
  { path: 'apply', component: ApplicationFormComponent },
  { path: 'profile/:id', component: StudentProfileComponent },
  { path: '**', redirectTo: '' }
];

import { Component } from '@angular/core';
import { StudentDashboardComponent } from './components/student-dashboard.component';
import { JobsListComponent } from './components/jobs-list.component';

@Component({
  selector: 'app-root',
  imports: [StudentDashboardComponent, JobsListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

import { Component } from '@angular/core';
import { StudentDashboardComponent } from './components/student-dashboard.component';

@Component({
  selector: 'app-root',
  imports: [StudentDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

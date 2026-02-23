import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  studentCount = 0;
  jobCount = 0;
  applicationCount = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getStudents().subscribe(students => {
      this.studentCount = students.length;
      this.applicationCount = students.reduce((acc, s) => acc + (s.application_count || 0), 0);
    });

    this.apiService.getJobs().subscribe(jobs => {
      this.jobCount = jobs.length;
    });
  }
}

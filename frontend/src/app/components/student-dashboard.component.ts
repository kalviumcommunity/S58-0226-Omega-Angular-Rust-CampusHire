import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

interface Student {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  students: Student[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('StudentDashboard: ngOnInit called');
    this.fetchStudents();
  }

  fetchStudents(): void {
    console.log('StudentDashboard: fetchStudents starting...');
    this.isLoading = true;
    this.error = null;

    this.apiService.getStudents().subscribe({
      next: (data) => {
        console.log('StudentDashboard: Received data:', data);
        this.students = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('StudentDashboard: Error fetching students:', err);
        this.error = 'Failed to load students. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

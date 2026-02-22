import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

interface Job {
  id: number;
  title: string;
  company: string;
  description?: string;
  salary_min?: number;
  created_at?: string;
}

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.css'
})
export class JobsListComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('JobsList: ngOnInit called');
    this.fetchJobs();
  }

  fetchJobs(): void {
    console.log('JobsList: fetchJobs starting...');
    this.isLoading = true;
    this.error = null;

    this.apiService.getJobs().subscribe({
      next: (data) => {
        console.log('JobsList: Received data:', data);
        this.jobs = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('JobsList: Error fetching jobs:', err);
        this.error = 'Failed to load jobs. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatSalary(salary?: number): string {
    if (!salary) return 'Not specified';
    return `₹${(salary / 100000).toFixed(1)}L`;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

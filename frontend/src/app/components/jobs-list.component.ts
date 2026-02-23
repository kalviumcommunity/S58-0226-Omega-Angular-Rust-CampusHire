import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.css'
})
export class JobsListComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = true;
  error: string | null = null;

  jobForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;
  showAddForm = false;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('JobsList: ngOnInit called');
    this.initForm();
    this.fetchJobs();
  }

  initForm(): void {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      salary_min: [null, [Validators.min(0)]]
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.jobForm.reset();
      this.submitError = null;
      this.submitSuccess = false;
    }
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    this.submitSuccess = false;

    const { title, company, description, salary_min } = this.jobForm.value;

    this.apiService.createJob(title, company, description, salary_min).subscribe({
      next: (newJob) => {
        this.submitSuccess = true;
        this.isSubmitting = false;
        this.jobs.unshift(newJob);
        this.jobForm.reset();

        setTimeout(() => {
          this.showAddForm = false;
          this.submitSuccess = false;
          this.cdr.detectChanges();
        }, 2000);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating job:', err);
        this.isSubmitting = false;
        this.submitError = 'Failed to create job. Please try again.';
        this.cdr.detectChanges();
      }
    });
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

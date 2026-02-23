import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
}

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.css'
})
export class ApplicationFormComponent implements OnInit {
  applicationForm!: FormGroup;
  students: Student[] = [];
  jobs: Job[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showForm = true;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log('ApplicationForm: ngOnInit called');
    this.initializeForm();
    this.loadStudents();
    this.loadJobs();

    // Check for jobId in query parameters
    this.route.queryParams.subscribe(params => {
      if (params['jobId']) {
        this.applicationForm.patchValue({ jobId: params['jobId'] });
      }
    });
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      studentId: ['', [Validators.required]],
      jobId: ['', [Validators.required]],
      message: ['', [Validators.maxLength(500)]]
    });
  }

  loadStudents(): void {
    console.log('ApplicationForm: Loading students...');
    this.apiService.getStudents().subscribe({
      next: (data) => {
        console.log('ApplicationForm: Students loaded:', data);
        this.students = data;
      },
      error: (err) => {
        console.error('ApplicationForm: Error loading students:', err);
        this.errorMessage = 'Failed to load students list.';
      }
    });
  }

  loadJobs(): void {
    console.log('ApplicationForm: Loading jobs...');
    this.apiService.getJobs().subscribe({
      next: (data) => {
        console.log('ApplicationForm: Jobs loaded:', data);
        this.jobs = data;
      },
      error: (err) => {
        console.error('ApplicationForm: Error loading jobs:', err);
        this.errorMessage = 'Failed to load jobs list.';
      }
    });
  }

  onSubmit(): void {
    if (!this.applicationForm.valid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const { studentId, jobId } = this.applicationForm.value;
    console.log('ApplicationForm: Submitting application', { studentId, jobId });

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.applyForJob(Number(studentId), Number(jobId)).subscribe({
      next: (response) => {
        console.log('ApplicationForm: Application submitted successfully:', response);
        this.successMessage = '✅ Application submitted successfully! We will notify you about the status.';
        this.showForm = false;
        this.isSubmitting = false;

        // Reset form after 3 seconds
        setTimeout(() => {
          this.applicationForm.reset();
          this.showForm = true;
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('ApplicationForm: Error submitting application:', err);
        this.isSubmitting = false;

        if (err.status === 400) {
          this.errorMessage = 'You have already applied for this job.';
        } else if (err.status === 404) {
          this.errorMessage = 'Student or job not found.';
        } else {
          this.errorMessage = 'Failed to submit application. Please try again.';
        }
      }
    });
  }

  resetForm(): void {
    this.applicationForm.reset();
    this.errorMessage = null;
    this.successMessage = null;
  }

  getSelectedStudentName(): string {
    const studentId = this.applicationForm.get('studentId')?.value;
    if (!studentId) return '';
    const student = this.students.find(s => s.id === parseInt(studentId));
    return student ? student.name : '';
  }

  getSelectedJobTitle(): string {
    const jobId = this.applicationForm.get('jobId')?.value;
    if (!jobId) return '';
    const job = this.jobs.find(j => j.id === parseInt(jobId));
    return job ? `${job.title} at ${job.company}` : '';
  }
}

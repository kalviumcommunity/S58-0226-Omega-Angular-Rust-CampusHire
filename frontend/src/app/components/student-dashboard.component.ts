import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface Student {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  application_count?: number;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  students: Student[] = [];
  isLoading = true;
  error: string | null = null;

  studentForm!: FormGroup;
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
    console.log('StudentDashboard: ngOnInit called');
    this.initForm();
    this.fetchStudents();
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.studentForm.reset();
      this.submitError = null;
      this.submitSuccess = false;
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    this.submitSuccess = false;

    const { name, email } = this.studentForm.value;

    this.apiService.createStudent(name, email).subscribe({
      next: (newStudent) => {
        this.submitSuccess = true;
        this.isSubmitting = false;
        // Optionally prepend instead of refetching
        this.students.unshift(newStudent);
        this.studentForm.reset();

        setTimeout(() => {
          this.showAddForm = false;
          this.submitSuccess = false;
          this.cdr.detectChanges();
        }, 2000);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating student:', err);
        this.isSubmitting = false;
        if (err.status === 409) {
          this.submitError = 'A student with this email already exists.';
        } else {
          this.submitError = 'Failed to create student. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
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


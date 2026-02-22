import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

interface Student {
    id: number;
    name: string;
    email: string;
    created_at?: string;
}

interface Application {
    id: number;
    job_id: number;
    job_title: string;
    job_company: string;
    status: string;
    applied_at: string;
}

@Component({
    selector: 'app-student-profile',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './student-profile.component.html',
    styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent implements OnInit {
    student: Student | null = null;
    applications: Application[] = [];
    isLoading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const studentId = parseInt(idParam, 10);
            this.loadStudentData(studentId);
        } else {
            this.error = 'Invalid student ID.';
            this.isLoading = false;
        }
    }

    loadStudentData(id: number): void {
        this.isLoading = true;
        this.error = null;

        // Load Student Profile
        this.apiService.getStudentById(id).subscribe({
            next: (studentData) => {
                this.student = studentData;

                // Output from first API is successful, now load applications
                this.apiService.getStudentApplications(id).subscribe({
                    next: (appsData) => {
                        this.applications = appsData;
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        console.error('Error fetching applications:', err);
                        // We set apps to empty and ignore error for apps if we want
                        this.applications = [];
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    }
                });
            },
            error: (err) => {
                console.error('Error fetching student profile:', err);
                this.error = 'Failed to load student profile.';
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
            day: 'numeric'
        });
    }
}

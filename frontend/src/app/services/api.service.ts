import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiBaseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * GET request to fetch all students
   */
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/students`);
  }

  /**
   * GET request to fetch all jobs
   */
  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/jobs`);
  }

  /**
   * POST request to create a new student
   * @param name - Student name
   * @param email - Student email
   */
  createStudent(name: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/students`, { name, email });
  }

  /**
   * POST request to create a new job
   * @param title - Job title
   * @param company - Company name
   * @param description - Job description
   * @param salary_min - Minimum salary
   */
  createJob(
    title: string,
    company: string,
    description?: string,
    salary_min?: number
  ): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/jobs`, {
      title,
      company,
      description,
      salary_min
    });
  }

  /**
   * POST request to apply for a job
   * @param student_id - Student ID
   * @param job_id - Job ID
   */
  applyForJob(student_id: number, job_id: number): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/applications`, {
      student_id,
      job_id
    });
  }

  /**
   * GET backend status
   */
  getStatus(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/status');
  }
}

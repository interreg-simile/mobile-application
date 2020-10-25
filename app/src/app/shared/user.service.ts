import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {GenericApiResponse} from './utils.interface';

export interface User {
  email: string;
  name: string;
  surname: string;
  city?: string;
  yearOfBirth?: string;
  gender?: string;
}

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  async getUser(): Promise<User> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/users/${this.authService.userId}`;

    const res = await this.http.get<GenericApiResponse>(url).toPromise();
    return res.data;
  }

  async changeEmail(email: string): Promise<void> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/users/${this.authService.userId}/change-email`;

    const body = {email};

    await this.http.patch<GenericApiResponse>(url, body).toPromise();
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<void> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/users/${this.authService.userId}/change-password`;

    const body = {oldPassword, newPassword, confirmNewPassword};

    await this.http.patch<GenericApiResponse>(url, body).toPromise();
  }

  async changeInfo(
    name?: string,
    surname?: string,
    city?: string,
    yearOfBirth?: number,
    gender?: string
  ): Promise<void> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/users/${this.authService.userId}/change-info`;

    const body = {name, surname, city, yearOfBirth, gender};

    await this.http.patch<GenericApiResponse>(url, body).toPromise();
  }

  async deleteUser(): Promise<void> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/users/${this.authService.userId}`;
    await this.http.delete(url).toPromise();
  }
}

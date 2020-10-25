import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {GenericApiResponse} from './utils.interface';
import {Storage} from '@ionic/storage';

interface LoginResponse {
  token: string;
  userId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  public isGuest: boolean;
  public token: string;
  public userId: string;

  private readonly _storageKeyGuest = 'isGuest';
  private readonly _storageKeyToken = 'token';
  private readonly _storageKeyUserId = 'userId';

  constructor(private http: HttpClient, private storage: Storage) {
  }

  async retrieveAuthStatus(): Promise<void> {
    this.isGuest = await this.storage.get(this._storageKeyGuest);
    this.token = await this.storage.get(this._storageKeyToken);
    this.userId = await this.storage.get(this._storageKeyUserId);

    console.log(this.isGuest, this.token, this.userId);
  }

  isUserAuthenticated() {
    return this.isGuest || (this.token && this.userId);
  }

  isLoggedIn() {
    return this.token && this.userId;
  }

  async login(email: string, password: string): Promise<void> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/auth/login`;

    const body = {email, password};

    const res = await this.http.post<GenericApiResponse>(url, body).toPromise();
    const data: LoginResponse = res.data;

    await this.storage.set(this._storageKeyGuest, false);
    await this.storage.set(this._storageKeyToken, data.token);
    await this.storage.set(this._storageKeyUserId, data.userId);

    this.isGuest = false;
    this.token = data.token;
    this.userId = data.userId;
  }

  async signAsGuest(): Promise<void> {
    await this.storage.set(this._storageKeyGuest, true);
    await this.storage.remove(this._storageKeyToken);
    await this.storage.remove(this._storageKeyUserId);

    this.isGuest = true;
    this.token = null;
    this.userId = null;
  }

  async logout(): Promise<void> {
    await this.storage.remove(this._storageKeyGuest);
    await this.storage.remove(this._storageKeyToken);
    await this.storage.remove(this._storageKeyUserId);

    this.isGuest = null;
    this.token = null;
    this.userId = null;
  }

  async register(
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    surname: string,
    city: string,
    yearOfBirth: number,
    gender: string
  ): Promise<void> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/auth/register`;

    const body = {
      email,
      password,
      confirmPassword,
      name,
      surname,
      city,
      yearOfBirth,
      gender,
    };

    await this.http.post<GenericApiResponse>(url, body).toPromise();
  }
}

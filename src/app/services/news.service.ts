import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../models/story';
import { PagedResult } from '../models/paged-result.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'https://localhost:7192/api/News/newest';

  constructor(private http: HttpClient) {}

  getNewestStories(page: number, pageSize: number, query: string = ''): Observable<PagedResult<Story>> {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    if (query) {
      params = params.set('query', query);
    }
    return this.http.get<PagedResult<Story>>(this.apiUrl, { params });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../models/article';

export const API_URL = 'https://jsonplaceholder.typicode.com';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly http = inject(HttpClient);

  /** Loads the first 12 articles: GET {API_URL}/posts?_limit=12 */
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${API_URL}/posts`, { params: { _limit: 12 } });
  }
}

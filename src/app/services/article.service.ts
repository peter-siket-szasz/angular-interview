import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Article } from '../models/article';

export const API_URL = 'https://jsonplaceholder.typicode.com';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  // TODO (Task 2a): inject Angular's HttpClient.

  /** Loads the first 12 articles: GET {API_URL}/posts?_limit=12 */
  getArticles(): Observable<Article[]> {
    // TODO (Task 2b): replace EMPTY with a real HTTP request.
    return EMPTY;
  }
}

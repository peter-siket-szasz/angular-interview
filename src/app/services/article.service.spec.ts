import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Article } from '../models/article';
import { MOCK_ARTICLES } from '../testing/mock-articles';
import { API_URL, ArticleService } from './article.service';

describe('Task 2 - ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('sends a GET request for the first 12 posts', () => {
    service.getArticles().subscribe();

    const req = httpMock.expectOne((r) => r.urlWithParams === `${API_URL}/posts?_limit=12`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_ARTICLES);
  });

  it('emits the articles returned by the API', () => {
    let result: Article[] | undefined;
    service.getArticles().subscribe((articles) => (result = articles));

    httpMock.expectOne((r) => r.urlWithParams === `${API_URL}/posts?_limit=12`).flush(MOCK_ARTICLES);

    expect(result).toEqual(MOCK_ARTICLES);
  });

  it('does not send a request until someone subscribes', () => {
    service.getArticles();

    httpMock.expectNone(`${API_URL}/posts?_limit=12`);
  });
});

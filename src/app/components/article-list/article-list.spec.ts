import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_URL } from '../../services/article.service';
import { ReadingListService } from '../../services/reading-list.service';
import { MOCK_ARTICLES } from '../../testing/mock-articles';
import { ArticleList } from './article-list';

describe('Task 5 - ArticleList', () => {
  let fixture: ComponentFixture<ArticleList>;
  let httpMock: HttpTestingController;
  let host: HTMLElement;

  const byTestId = (id: string) => host.querySelector<HTMLElement>(`[data-testid="${id}"]`);
  const cards = () => Array.from(host.querySelectorAll<HTMLElement>('app-article-card'));
  const expectArticlesRequest = () =>
    httpMock.expectOne((r) => r.urlWithParams === `${API_URL}/posts?_limit=12`);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(ArticleList);
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('shows only the loading indicator while the request is pending', () => {
    expectArticlesRequest();

    expect(byTestId('loading')).not.toBeNull();
    expect(byTestId('empty')).toBeNull();
    expect(cards().length).toBe(0);
  });

  it('renders one card per article once they are loaded', async () => {
    expectArticlesRequest().flush(MOCK_ARTICLES);
    await fixture.whenStable();

    expect(byTestId('loading')).toBeNull();
    expect(byTestId('empty')).toBeNull();
    expect(cards().length).toBe(MOCK_ARTICLES.length);
    expect(cards()[1].textContent).toContain('Qui Est Esse');
  });

  it('shows the empty state when the API returns no articles', async () => {
    expectArticlesRequest().flush([]);
    await fixture.whenStable();

    expect(byTestId('loading')).toBeNull();
    expect(byTestId('empty')).not.toBeNull();
    expect(cards().length).toBe(0);
  });

  it('passes the saved state from ReadingListService to the cards', async () => {
    TestBed.inject(ReadingListService).toggle(2);

    expectArticlesRequest().flush(MOCK_ARTICLES);
    await fixture.whenStable();

    const buttons = cards().map((c) => c.querySelector('[data-testid="toggle"]')!.textContent?.trim());
    expect(buttons).toEqual(['Save', 'Remove', 'Save']);
  });

  it('toggles the article in ReadingListService when a card button is clicked', async () => {
    const readingList = TestBed.inject(ReadingListService);
    expectArticlesRequest().flush(MOCK_ARTICLES);
    await fixture.whenStable();

    cards()[0].querySelector<HTMLElement>('[data-testid="toggle"]')!.click();
    await fixture.whenStable();

    expect(readingList.isSaved(MOCK_ARTICLES[0].id)).toBe(true);
    expect(cards()[0].querySelector('[data-testid="toggle"]')!.textContent?.trim()).toBe('Remove');
  });
});

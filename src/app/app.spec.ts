import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ReadingListService } from './services/reading-list.service';

describe('App shell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('renders the header and the article list', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('h1')?.textContent).toContain('Reading List');
    expect(host.querySelector('app-article-list')).not.toBeNull();
  });

  it('(Task 3) shows the number of saved articles in the header', () => {
    const fixture = TestBed.createComponent(App);
    const host = fixture.nativeElement as HTMLElement;
    const badge = () => host.querySelector('[data-testid="saved-count"]')?.textContent?.trim();
    fixture.detectChanges();

    expect(badge()).toBe('Saved: 0');

    TestBed.inject(ReadingListService).toggle(1);
    fixture.detectChanges();

    expect(badge()).toBe('Saved: 1');
  });
});

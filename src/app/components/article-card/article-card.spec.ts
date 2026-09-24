import { inputBinding, outputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Article } from '../../models/article';
import { MOCK_ARTICLES } from '../../testing/mock-articles';
import { ArticleCard } from './article-card';

describe('Task 4 - ArticleCard', () => {
  async function setup(initial: Article = MOCK_ARTICLES[0]) {
    const article = signal(initial);
    const saved = signal(false);
    const emitted: Article[] = [];

    const fixture = TestBed.createComponent(ArticleCard, {
      bindings: [
        inputBinding('article', article),
        inputBinding('saved', saved),
        outputBinding<Article>('saveToggled', (a) => emitted.push(a)),
      ],
    });
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    const byTestId = (id: string) => host.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;

    return { fixture, article, saved, emitted, host, byTestId };
  }

  it('renders the title using the titlecase pipe', async () => {
    const { byTestId } = await setup();

    expect(byTestId('title').textContent?.trim()).toBe('Sunt Aut Facere Repellat Provident');
  });

  it('renders the body truncated to 100 characters', async () => {
    const { byTestId } = await setup();
    const expected = MOCK_ARTICLES[0].body.slice(0, 100).trimEnd() + '…';

    expect(byTestId('body').textContent?.trim()).toBe(expected);
  });

  it('renders a short body unchanged', async () => {
    const { byTestId } = await setup(MOCK_ARTICLES[2]);

    expect(byTestId('body').textContent?.trim()).toBe('short body');
  });

  it('shows "Save" when the article is not saved', async () => {
    const { byTestId, host } = await setup();

    expect(byTestId('toggle').textContent?.trim()).toBe('Save');
    expect(host.querySelector('article')!.classList).not.toContain('saved');
  });

  it('shows "Remove" and the `saved` CSS class when the article is saved', async () => {
    const { fixture, saved, byTestId, host } = await setup();

    saved.set(true);
    await fixture.whenStable();

    expect(byTestId('toggle').textContent?.trim()).toBe('Remove');
    expect(host.querySelector('article')!.classList).toContain('saved');
  });

  it('emits the article via `saveToggled` when the button is clicked', async () => {
    const { byTestId, emitted } = await setup();

    byTestId('toggle').click();

    expect(emitted).toEqual([MOCK_ARTICLES[0]]);
  });

  it('re-renders when the `article` input changes', async () => {
    const { fixture, article, byTestId } = await setup();

    article.set(MOCK_ARTICLES[1]);
    await fixture.whenStable();

    expect(byTestId('title').textContent?.trim()).toBe('Qui Est Esse');
  });
});

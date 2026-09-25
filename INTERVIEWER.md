# Interviewer Guide: Reading List

> This file only exists on the `solution` branch. Give candidates the `main` branch.

Run `git diff main solution -- src` to see the full reference solution.

## Before the interview

1. Clone the repo, check out `main` and run `npm install`.
2. Run `npm start` once and check that https://jsonplaceholder.typicode.com is reachable from the
   candidate's machine or network. The unit tests do **not** need network access.
3. Run `npm run test:ci`. On `main` you should see **22 failing / 8 passing** tests.
   On `solution` all **30** pass.

## Format (30 min + 10 min discussion)

| Time      | What                                                        |
| --------- | ----------------------------------------------------------- |
| 0-3 min   | Candidate reads the README; you answer questions            |
| 3-30 min  | Tasks 1-5 (the candidate drives, you observe and ask "why") |
| 30-40 min | Discussion questions (see below)                            |

If the candidate is stuck on one task for more than about 5 minutes, give a hint so they can
still show the later topics. **Task 4 and Task 5 give you the most signal.**

## Topic focus

| Topic                               | Weight | Where                 |
| ----------------------------------- | ------ | --------------------- |
| Components: inputs, outputs, templates | High   | Task 4, Task 5        |
| Services and DI (`inject`, `providedIn`) | High   | Task 2, Task 3, Task 5 |
| Signals (`signal`, `computed`, read-only) | Medium | Task 3, Task 5       |
| Pipes (custom and built-in)         | Medium | Task 1, Task 4        |
| HTTP and Observables                | Medium | Task 2, Task 5        |
| Control flow (`@if`, `@for`, `track`) | Medium | Task 5                |
| Routing, forms, testing             | Low    | Bonus or discussion only |

## Reference solution and what to look for

### Task 1: `TruncatePipe`

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 80): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return `${value.slice(0, limit).trimEnd()}…`;
  }
}
```

The `@Pipe` / `PipeTransform` boilerplate is provided, so this task is only about the logic.

- Good: handles the edge cases (null, exactly at the limit, trailing whitespace) without
  running the tests over and over. Understands that the pipe must be added to the `imports`
  of the component that uses it (seen in Task 4).
- Watch for: using `substring` is fine too. Off-by-one errors at the limit.
- Ask: *What is a pure pipe? When is `transform` called again? Why is a pipe better than calling
  a method like `{{ truncate(text) }}` in the template?*

### Task 2: `ArticleService`

```ts
private readonly http = inject(HttpClient);

getArticles(): Observable<Article[]> {
  return this.http.get<Article[]>(`${API_URL}/posts`, { params: { _limit: 12 } });
}
```

Plus `provideHttpClient(withFetch())` in `app.config.ts`. The tests provide it themselves, so a
missing provider only shows up in the browser as `NullInjectorError: No provider for HttpClient`.
That is a good moment to see how the candidate debugs.

- Good: returns the Observable and does **not** subscribe inside the service.
- Watch for: subscribing in the service, storing the result in a field, or using `any`.
- Ask: *Is the request sent when `getArticles()` is called? (No, Observables are cold, only on
  subscribe.) What does `providedIn: 'root'` mean? How would you provide a different instance
  per component?*

### Task 3: `ReadingListService`

```ts
private readonly ids = signal<readonly number[]>([]);
readonly savedIds = this.ids.asReadonly();
readonly count = computed(() => this.ids().length);

isSaved(id: number): boolean {
  return this.ids().includes(id);
}

toggle(id: number): void {
  this.ids.update((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
}
```

`ids` and `savedIds` are declared in the starter, and `toggle` has a `this.ids.update(...)` hint.
`count` is only a `signal(0)` placeholder. The README just says it must "always match `ids`" and
does **not** mention `computed`, so the candidate has to come up with it.

- Good: replaces the placeholder with `computed(() => this.ids().length)` without being told,
  and returns a new array from `update`.
- Watch for: keeping `count` as a writable signal and updating it by hand in `toggle`. The tests
  still pass, but it duplicates state that can get out of sync, so ask why `computed` is better.
  Also watch for `this.ids().push(id)` (mutation; the signal does not notify, and a test catches
  this), or `set` with a mutated array. Using `savedIds()` instead of `ids()` for reading is fine.
- Ask: *Difference between `signal`, `computed` and `effect`? Why must the update be immutable?
  Why is `ids` private and exposed via `asReadonly()`? Why do all components see the same list?
  (Singleton root injector.)*

### Task 4: `ArticleCard`

```ts
readonly article = input.required<Article>();
readonly saved = input(false);
readonly saveToggled = output<Article>();
```

```html
<article class="card" [class.saved]="saved()">
  <h3 data-testid="title">{{ article().title | titlecase }}</h3>
  <p data-testid="body">{{ article().body | truncate: 100 }}</p>
  <button type="button" data-testid="toggle" (click)="saveToggled.emit(article())">
    {{ saved() ? 'Remove' : 'Save' }}
  </button>
</article>
```

`imports: [TitleCasePipe, TruncatePipe]`

- Good: signal-based `input()`/`output()`, calls inputs as functions in the template, class
  binding, remembers the component `imports`.
- Acceptable: `@Input({ required: true }) article!: Article;` / `@Output() saveToggled = new
  EventEmitter<Article>()`. Ask the candidate to compare it with the signal APIs.
- Watch for: injecting `ReadingListService` in the card (this breaks the presentational/container
  split), or forgetting the pipe imports (compile error).
- Ask: *Why is this component "dumb"? What are the benefits? What does `input.required` give you
  compared to `input()`?*

### Task 5: `ArticleList`

```ts
private readonly articleService = inject(ArticleService);
protected readonly readingList = inject(ReadingListService);
protected readonly articles = toSignal(this.articleService.getArticles());

protected onSaveToggled(article: Article): void {
  this.readingList.toggle(article.id);
}
```

```html
@if (articles(); as list) {
  <section class="grid" data-testid="list">
    @for (article of list; track article.id) {
      <app-article-card
        [article]="article"
        [saved]="readingList.isSaved(article.id)"
        (saveToggled)="onSaveToggled($event)"
      />
    }
  </section>
  @if (list.length === 0) {
    <p data-testid="empty">No articles found.</p>
  }
} @else {
  <p data-testid="loading">Loading articles…</p>
}
```

The README and the TODO both point to `toSignal()`. Subscribing in `ngOnInit` and calling `set`
on a signal, or `rxResource`, also pass the tests but are not what we are looking for. Using
`@for … @empty` for the empty state is fine.

- Good: `track article.id`, distinguishes "loading" (`undefined`) from "empty" (`[]`), uses
  `$event`.
- Watch for: ignoring the hint and subscribing in the constructor, especially storing the result
  in a **plain field**. Because components are `OnPush` + zoneless by default in v22, the view
  **will not update**. This is a very good discussion point. Also watch for `track $index` and
  unmanaged subscriptions (memory leaks).
- Ask: *What does `track` do and why does it matter? Who unsubscribes when you use `toSignal`?
  (It unsubscribes automatically when the component is destroyed.) Why do the "Saved" buttons
  and the header badge stay in sync?*

## Discussion questions (pick 3-4)

1. What happens if two components inject `ReadingListService`? How would you give each
   component its own instance? (`providers: [ReadingListService]` on the component.)
2. Signals vs. Observables: when would you use which? How do you convert between them?
3. What is `OnPush`/zoneless change detection? What triggers a re-render?
4. How would you add a detail page `/articles/:id`? (Routing, `withComponentInputBinding`,
   route params as inputs.)
5. How would you handle HTTP errors globally? (Interceptors, `withInterceptors`.)
6. How would you test `ArticleCard` without its pipes, or `ArticleList` without a real service?

## Bonus reference snippets

**Search** (in `ArticleList`):

```ts
protected readonly query = signal('');
protected readonly filtered = computed(() => {
  const q = this.query().toLowerCase();
  return this.articles()?.filter((a) => a.title.toLowerCase().includes(q));
});
```

```html
<input placeholder="Search…" [value]="query()" (input)="query.set($any($event.target).value)" />
```

**Error state:** use `rxResource({ stream: () => this.articleService.getArticles() })` and
`resource.error()`, or `catchError` in the component.

**Persistence** (in `ReadingListService`):

```ts
private readonly ids = signal<readonly number[]>(JSON.parse(localStorage.getItem('reading-list') ?? '[]'));
private readonly persist = effect(() => localStorage.setItem('reading-list', JSON.stringify(this.ids())));
```

## Scoring rubric

| Score | Description                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------- |
| 1     | Could not finish Task 2 without a lot of help; unclear on components/services                  |
| 2     | Tasks 1-3 done; needed help with inputs/outputs or templates                                   |
| 3     | Tasks 1-4 done, Task 5 partly done; solid basics, some gaps (e.g. mutation, subscriptions)      |
| 4     | All tasks done with small hints; good explanations of DI, signals and change detection         |
| 5     | All tasks done on their own, clean code, a bonus started, strong answers to the discussion questions |

For 1-2 years of experience, a **3** is a solid result and a **4** is a strong hire signal.

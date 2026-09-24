# Angular Live Coding: Reading List

Welcome! In this exercise you will finish a small **Angular 22** app that loads articles from
[JSONPlaceholder](https://jsonplaceholder.typicode.com/posts) and lets the user save them to a
personal reading list.

- **Time box:** 30 minutes
- **Focus:** pipes, services, dependency injection, HTTP, signals, component inputs/outputs,
  template syntax
- You can use the official docs at [angular.dev](https://angular.dev). Please **think out loud**,
  we are more interested in how you approach the problem than in a perfect result.
- The tasks build on each other. Work through them **in order**. It is fine if you do not finish
  everything.

```
┌──────────────────────────────────────────────────────────────┐
│ Reading List                                      [Saved: 2] │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐ │
│ │ Sunt Aut Facere… │ │ Qui Est Esse     │ │ Ea Molestias…  │ │
│ │ quia et suscipit │ │ est rerum tempo… │ │ et iusto sed…  │ │
│ │ [ Save ]         │ │ [ Remove ]       │ │ [ Save ]       │ │
│ └──────────────────┘ └──────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

> Styling is already done; you do not need to write any CSS.

---

## Getting started

Requirements: Node.js `^22.22.3 || ^24.15.0 || >=26` and npm.

```bash
npm install
npm start          # dev server on http://localhost:4200
npm test           # runs the unit tests in watch mode (Vitest)
```

Every task has its own test suite. The tests are **already written**. Your job is to make them pass.
To run only the tests for one task:

```bash
npm test -- --filter "Task 1"
```

Run `npm run test:ci` for a single run without watch mode.

---

## Project overview

```
src/app/
├── app.ts / app.html                  App shell (header + list). Already done.
├── app.config.ts                      Application providers                 -> Task 2
├── models/article.ts                  The Article interface. Already done.
├── pipes/truncate.pipe.ts             Custom pipe                           -> Task 1
├── services/article.service.ts        Loads articles over HTTP              -> Task 2
├── services/reading-list.service.ts   Reading list state with signals       -> Task 3
├── components/article-card/           Displays one article (presentational) -> Task 4
├── components/article-list/           Loads & renders the articles (smart)  -> Task 5
└── testing/mock-articles.ts           Test data used by the specs
```

Search the project for `TODO (Task` to find every place you need to change.

Good to know about this Angular version:

- Everything is **standalone**, so there are no `NgModule`s. Components, pipes and directives are
  added to the `imports` array of the component that uses them.
- The app is **zoneless** and components use **`OnPush`** change detection by default. Keep UI
  state in **signals** so the view updates.
- Prefer `inject()` over constructor injection, and the built-in control flow (`@if`, `@for`) over
  `*ngIf` / `*ngFor`.

---

## Tasks

### Task 1: `truncate` pipe

File: [src/app/pipes/truncate.pipe.ts](src/app/pipes/truncate.pipe.ts)

The pipe boilerplate (`@Pipe({ name: 'truncate' })`, `PipeTransform`) is already in place.
Templates can use it as `{{ text | truncate: 100 }}`.

Implement `transform(value, limit = 80)`:

- `null` / `undefined` returns `''`.
- Text with `length <= limit` is returned unchanged.
- Longer text is cut to the first `limit` characters. Trailing whitespace is removed and
  a single ellipsis character **`…`** (U+2026) is appended.

| Input                     | Limit | Output        |
| ------------------------- | ----- | ------------- |
| `'Hello'`                 | 10    | `'Hello'`     |
| `'Hello wonderful world'` | 8     | `'Hello wo…'` |
| `'Hello wonderful world'` | 6     | `'Hello…'`    |

### Task 2: `ArticleService`

Files: [src/app/services/article.service.ts](src/app/services/article.service.ts),
[src/app/app.config.ts](src/app/app.config.ts)

1. Make `HttpClient` available to the application in `app.config.ts`.
2. In `ArticleService`, inject `HttpClient` and implement `getArticles()` so that it sends
   `GET https://jsonplaceholder.typicode.com/posts?_limit=12` (use the exported `API_URL`) and
   returns the response as `Observable<Article[]>`.

### Task 3: `ReadingListService`

File: [src/app/services/reading-list.service.ts](src/app/services/reading-list.service.ts)

The reading list is managed with **signals**. The signals are already declared:

- `ids`: **private** writable signal with the saved article ids (the state)
- `savedIds`: public **read-only** view of `ids`
- `count`: `computed` signal derived from `ids`

Your job is to implement the logic, working only with the private `ids` signal:

1. **`count`**: return the number of saved ids.
2. **`isSaved(id)`**: return `true` if the id is on the list.
3. **`toggle(id)`**: add the id (at the end) if it is missing, otherwise remove it. Use
   `this.ids.update(...)` and return a **new** array. Do not mutate the existing one.

When this works, the "Saved: N" badge in the header updates automatically.

### Task 4: `ArticleCard` component

Files: [article-card.ts](src/app/components/article-card/article-card.ts),
[article-card.html](src/app/components/article-card/article-card.html)

This is a **presentational** component. It only gets data through inputs and reports user
actions through an output. It must not inject any service.

1. Inputs:
   - `article`: **required**, type `Article`
   - `saved`: `boolean`, defaults to `false`
2. Output: `saveToggled`, which emits the current `Article` when the button is clicked.
3. Template (keep the existing `data-testid` attributes):
   - title formatted with Angular's built-in **`titlecase`** pipe
   - body shortened to **100** characters with your **`truncate`** pipe
   - button label is `Save` or `Remove`, depending on `saved`
   - the `<article>` element gets the CSS class **`saved`** while the article is saved

### Task 5: `ArticleList` component

Files: [article-list.ts](src/app/components/article-list/article-list.ts),
[article-list.html](src/app/components/article-list/article-list.html)

This is the **smart/container** component that connects services and the UI.

1. Inject `ArticleService` and `ReadingListService`.
2. Load the articles through `ArticleService` and keep them in a signal.
   Use `toSignal()`
   from `@angular/core/rxjs-interop` rather than subscribing manually in the constructor or in
   `ngOnInit`. The signal's value is `undefined` until the data has arrived.
3. Template (keep the existing `data-testid` attributes):
   - while loading, show **only** the `loading` paragraph
   - when loaded, render one `<app-article-card>` per article inside the `list` section.
     Use `@for` with a sensible `track` expression.
   - pass `article` and `saved` to every card
   - if the API returns an empty array, show the `empty` paragraph
4. When a card emits `saveToggled`, toggle that article in the `ReadingListService`.

Finally, open http://localhost:4200. You should see 12 articles, and saving/removing them should
update the header badge.

---

## Bonus (only if you have time left)

These have no tests. Pick whichever you like:

- **Search:** add a text input above the list that filters the articles by title
  (case-insensitive) using a `computed` signal.
- **Error state:** show a friendly message if the request fails. You can try it by changing the
  URL.
- **Persistence:** keep the reading list in `localStorage` so it survives a page reload.

Good luck and have fun!

import { Component } from '@angular/core';

/** Smart/container component: loads the articles and connects them to the reading list. */
@Component({
  selector: 'app-article-list',
  imports: [],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList {
  // TODO (Task 5a): inject `ArticleService` and `ReadingListService`.
  // TODO (Task 5b): load the articles via `ArticleService` and keep them in a signal.
  //   Hint: don't subscribe manually in the constructor or `ngOnInit`. Use `toSignal()` from
  //   '@angular/core/rxjs-interop' to turn the Observable into a signal. It subscribes and
  //   unsubscribes for you, and its value is `undefined` until the data has arrived.
  // TODO (Task 5d): when a card emits `saveToggled`, toggle that article in the reading list.
}

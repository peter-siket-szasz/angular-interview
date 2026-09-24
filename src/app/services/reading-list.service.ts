import { Injectable, Signal, signal } from '@angular/core';

/** Keeps track of the articles the user saved to their reading list. */
@Injectable({ providedIn: 'root' })
export class ReadingListService {
  // TODO (Task 3a): keep the saved article ids in a *private* writable signal
  //                 and expose them here as a read-only signal.
  readonly savedIds: Signal<readonly number[]> = signal([]);

  // TODO (Task 3b): derive the number of saved articles from the state above.
  readonly count: Signal<number> = signal(0);

  /** Returns `true` if the article with the given id is on the reading list. */
  isSaved(id: number): boolean {
    // TODO (Task 3c)
    return false;
  }

  /** Adds the id if it is not saved yet, otherwise removes it. */
  toggle(id: number): void {
    // TODO (Task 3d)
  }
}

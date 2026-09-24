import { Injectable, computed, signal } from '@angular/core';

/** Keeps track of the articles the user saved to their reading list. */
@Injectable({ providedIn: 'root' })
export class ReadingListService {
  /** Writable state: the ids of the saved articles, in the order they were saved. */
  private readonly ids = signal<readonly number[]>([]);

  /** Read-only view of the state for consumers. */
  readonly savedIds = this.ids.asReadonly();

  /** Number of saved articles. */
  readonly count = computed(() => {
    // TODO (Task 3a): return the number of saved ids.
    return 0;
  });

  /** Returns `true` if the article with the given id is on the reading list. */
  isSaved(id: number): boolean {
    // TODO (Task 3b)
    return false;
  }

  /** Adds the id if it is not saved yet, otherwise removes it. */
  toggle(id: number): void {
    // TODO (Task 3c): signals must be updated immutably, so always return a NEW array:
    //   this.ids.update((ids) => /* new array with `id` added or removed */);
  }
}

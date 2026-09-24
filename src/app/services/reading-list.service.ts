import { Injectable, computed, signal } from '@angular/core';

/** Keeps track of the articles the user saved to their reading list. */
@Injectable({ providedIn: 'root' })
export class ReadingListService {
  private readonly ids = signal<readonly number[]>([]);

  readonly savedIds = this.ids.asReadonly();

  readonly count = computed(() => this.ids().length);

  /** Returns `true` if the article with the given id is on the reading list. */
  isSaved(id: number): boolean {
    return this.ids().includes(id);
  }

  /** Adds the id if it is not saved yet, otherwise removes it. */
  toggle(id: number): void {
    this.ids.update((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  }
}

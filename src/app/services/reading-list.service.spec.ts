import { computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReadingListService } from './reading-list.service';

describe('Task 3 - ReadingListService', () => {
  let service: ReadingListService;

  beforeEach(() => {
    service = TestBed.inject(ReadingListService);
  });

  it('starts with an empty reading list', () => {
    expect(service.savedIds()).toEqual([]);
    expect(service.count()).toBe(0);
    expect(service.isSaved(1)).toBe(false);
  });

  it('adds an article when it is toggled for the first time', () => {
    service.toggle(1);

    expect(service.savedIds()).toEqual([1]);
    expect(service.isSaved(1)).toBe(true);
  });

  it('removes an article when it is toggled a second time', () => {
    service.toggle(1);
    service.toggle(1);

    expect(service.savedIds()).toEqual([]);
    expect(service.isSaved(1)).toBe(false);
  });

  it('keeps multiple articles in the order they were saved', () => {
    service.toggle(3);
    service.toggle(1);
    service.toggle(2);
    service.toggle(1);

    expect(service.savedIds()).toEqual([3, 2]);
  });

  it('derives `count` from the saved ids (it is reactive)', () => {
    const doubled = computed(() => service.count() * 2);
    expect(doubled()).toBe(0);

    service.toggle(1);
    service.toggle(2);

    expect(service.count()).toBe(2);
    expect(doubled()).toBe(4);
  });

  it('updates the state immutably (a new array on every change)', () => {
    const before = service.savedIds();
    service.toggle(1);

    expect(service.savedIds()).not.toBe(before);
  });

  it('does not allow consumers to write to `savedIds` directly', () => {
    expect('set' in service.savedIds).toBe(false);
    expect('update' in service.savedIds).toBe(false);
  });
});

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  /**
   * Shortens `value` to at most `limit` characters.
   * See README.md (Task 1) for the exact rules.
   */
  transform(value: string | null | undefined, limit = 80): string {
    if (!value) {
      return '';
    }
    if (value.length <= limit) {
      return value;
    }
    return `${value.slice(0, limit).trimEnd()}…`;
  }
}

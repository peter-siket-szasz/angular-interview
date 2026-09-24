// TODO (Task 1a): turn this class into a standalone pipe named `truncate`.
export class TruncatePipe {
  /**
   * Shortens `value` to at most `limit` characters.
   * See README.md (Task 1) for the exact rules.
   */
  transform(value: string | null | undefined, limit = 80): string {
    // TODO (Task 1b): implement the truncation rules.
    return value ?? '';
  }
}

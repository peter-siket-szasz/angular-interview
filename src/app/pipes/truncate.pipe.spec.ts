import { TruncatePipe } from './truncate.pipe';

describe('Task 1 - TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('returns an empty string for null and undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns text shorter than the limit unchanged', () => {
    expect(pipe.transform('Hello', 10)).toBe('Hello');
  });

  it('returns text exactly at the limit unchanged', () => {
    expect(pipe.transform('Hello', 5)).toBe('Hello');
  });

  it('cuts long text at the limit and appends an ellipsis (…)', () => {
    expect(pipe.transform('Hello wonderful world', 8)).toBe('Hello wo…');
  });

  it('removes trailing whitespace before appending the ellipsis', () => {
    expect(pipe.transform('Hello wonderful world', 6)).toBe('Hello…');
  });

  it('uses a default limit of 80 characters', () => {
    const text = 'a'.repeat(100);
    expect(pipe.transform(text)).toBe('a'.repeat(80) + '…');
  });
});

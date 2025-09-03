import { expect } from 'chai';

export function expectUnderMs(start, end, maxMs) {
  expect(end - start).to.be.lessThan(maxMs);
}

import { getBookings } from "../utils/apiMethods.js";
import { expect } from "chai";
import { expectUnderMs } from '../utils/assertions.js';
describe('GET /booking - performance tests', () => {

  it('Verify the performance when retriving all booking IDs without filters and be fast (<2s)', async () => {
    const t0 = Date.now();
    const res = await getBookings();
    const t1 = Date.now();

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
    expect(res.data.length).to.be.greaterThan(0);

    expectUnderMs(t0, t1, 2000);

  })

})
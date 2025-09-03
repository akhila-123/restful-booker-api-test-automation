import { expect } from "chai";
import { getAuthToken } from "../utils/auth.js";
import { deleteBooking, createBooking, getBooking } from "../utils/apiMethods.js";
import { bookingPayload } from "../utils/bookingPayloadBuilder.js";

describe('verify DELETE booking API endpoint', () => {
  let token;
  let bookingId;

  before(async () => {
    token = await getAuthToken();
    // Creating a new booking
    const bookingPayloadJson = await bookingPayload();
    const createRes = await createBooking(bookingPayloadJson);
    expect(createRes.status).to.equal(200);
    bookingId = createRes.data.bookingid;
  });

  it('verify deleting an existing booking successfully', async () => {
    const response = await deleteBooking(bookingId, token);
    expect(response.status).to.eql(201);
    console.log(response.data);
  });

  // Verify fetching deleted booking returns 404
  it('verify the response when fetching a deleted booking is 404', async () => {
    await getBooking(bookingId)
      .then(() => { throw new Error("Expected 404 for deleted booking"); })
      .catch((err) => {
        expect(err.response.status).to.equal(404);
      });
  });

  // Verify deleting a booking with an invalid/non-existent ID
  it('verify deleting a booking with an invalid ID', async () => {
    await deleteBooking(999999, token)
      .then(() => { throw new Error("Expected 404 or 405 for invalid ID"); })
      .catch((err) => {
        expect([405]).to.include(err.response.status);
      });
  });

  // Verify deleting without authentication returns 403
  it('verify the response status is 403 when deleting without auth', async () => {
    await deleteBooking(bookingId, "")
      .then(() => { throw new Error("Expected 403 for missing auth"); })
      .catch((err) => {
        expect(err.response.status).to.equal(403);
      });
  });

  // Verify deletion success status code 201
  it('verify the response status is 201 when deletion succeeds', async () => {
    // Create another booking to delete
    const newBooking = await createBooking(await bookingPayload());
    const newId = newBooking.data.bookingid;

    const response = await deleteBooking(newId, token);
    expect(response.status).to.equal(201);
  });

  // Verify API handles concurrent deletions gracefully
  it('verify API handles concurrent deletions gracefully', async () => {
    // Create a booking to test concurrent deletion
    const newBooking = await createBooking(await bookingPayload());
    const newId = newBooking.data.bookingid;

    // Attempt two deletes concurrently
    const results = await Promise.allSettled([
      deleteBooking(newId, token),
      deleteBooking(newId, token),
    ]);

    // First should succeed
    expect(results[0].status === 'fulfilled' ? results[0].value.status : results[0].reason.response.status)
      .to.equal(201);

    // Second may fail with 405 (already deleted)
    expect(results[1].status === 'fulfilled' ? results[1].value.status : results[1].reason.response.status)
      .to.equal(405);
  });
});

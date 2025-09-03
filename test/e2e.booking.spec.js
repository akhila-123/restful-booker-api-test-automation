import { expect } from "chai";
import { getAuthToken } from "../utils/auth.js";
import {
  createBooking,
  getBooking,
  patchBooking,
  deleteBooking,
  getBookings
} from "../utils/apiMethods.js";
import { bookingPayload } from "../utils/bookingPayloadBuilder.js";
import { readFile } from "fs/promises";
// Load JSON test data dynamically
const rawData = await readFile(
  new URL("../testData/e2eBookingPayloads.json", import.meta.url)
);
const payloads = JSON.parse(rawData);

describe("Verify E2E booking", function () {
  this.timeout(20000);
  it("Verify complete lifecycle - create - update - verify - delete flow", async () => {
    const cookie = await getAuthToken();

    //Create
    const bookingPayloadJson = await bookingPayload(payloads.payload1);
    const createResponse = await createBooking(bookingPayloadJson);
    expect(createResponse.status).to.equal(200);
    const id = createResponse.data.bookingid;
    console.log("Booking id --- " + id);

    // Verify
    const verifyBooking = await getBooking(id);
    expect(verifyBooking.status).to.equal(200);
    expect(verifyBooking.data.firstname).to.equal(payloads.payload1.firstname);

    // Update
    const patchResponse = await patchBooking(
      id,
      payloads.payload2,
      cookie
    );
    expect(patchResponse.status).to.equal(200);
    expect(patchResponse.data.lastname).to.equal(payloads.payload2.lastname);

    // Verify update
    const verifyPatchBooking = await getBooking(id);
    expect(verifyPatchBooking.status).to.equal(200);
    expect(verifyPatchBooking.data.lastname).to.equal(payloads.payload2.lastname);

    // Delete
    const deleteBookingResponse = await deleteBooking(id, cookie);
    expect(deleteBookingResponse.status).to.equal(201);

    // Verify deletion
    const verifyDeleteBooking = await getBooking(id)
      .then(() => {
        throw new Error("Expected 404, request should fail");
      })
      .catch((error) => {
        expect(error.response.status).to.equal(404);
      });
  });

  it("Verify bulk operations - Create multiple - Filter - Update filtered results flow", async() => {
  const cookie = await getAuthToken();

  // 1. Create multiple bookings
  const bookingsData = [
    await bookingPayload(payloads.payload3),
    await bookingPayload(payloads.payload4),
    await bookingPayload(payloads.payload5),
  ];

  const bookingIds = [];
  for (const payload of bookingsData) {
    const response = await createBooking(payload);
    expect(response.status).to.equal(200);
    bookingIds.push(response.data.bookingid);
  }

  // 2. Filter bookings by firstname (example: 'Alice')

const bookingsDetails = await Promise.all(
  bookingIds.map(async (id) => {
    const res = await getBooking(id); // full booking object
    return { bookingid: id, ...res.data }; // include bookingid explicitly
  })
);

// Now filter by firstname
const firstBookings = bookingsDetails.filter(b => b.firstname === payloads.payload3.firstname);
expect(firstBookings.length).to.be.greaterThan(0);

  // 3. Update filtered results
  for (const b of firstBookings) {
  const patchRes = await patchBooking(
    b.bookingid,
    payloads.payload6,
    cookie
  );
  expect(patchRes.status).to.equal(200);
  expect(patchRes.data.lastname).to.equal(payloads.payload6.lastname);
}
});

  it("Verify cross-endpoint data consistency verification", async() => {
    const cookie = await getAuthToken();

  // 1. Create a booking
  const payload = await bookingPayload(payloads.payload7);
  const createRes = await createBooking(payload);
  expect(createRes.status).to.equal(200);
  const id = createRes.data.bookingid;

  // 2. Verify booking via GET
  const getRes = await getBooking(id);
  expect(getRes.status).to.equal(200);
  expect(getRes.data.firstname).to.equal(payload.payload7.firstname);

  // 3. Simulate cross-endpoint check
  // Example: GET all bookings and ensure this ID exists
  const allBookingsRes = await getBookings();
  const exists = allBookingsRes.data.some(b => b.bookingid === id);
  expect(exists).to.be.true;

  // 4. Optional: Clean up
  const deleteRes = await deleteBooking(id, cookie);
  expect(deleteRes.status).to.equal(201);
  });
});

import { expect } from "chai";
import { getAuthToken } from "../utils/auth.js";
import {
  createBooking,
  getBooking,
  patchBooking,
} from "../utils/apiMethods.js";
import { bookingPayload } from "../utils/bookingPayloadBuilder.js";
import { readFile } from "fs/promises";

// Load JSON test data dynamically
const rawData = await readFile(
  new URL("../testData/patchBookingScenarios.json", import.meta.url)
);
const patchScenarios = JSON.parse(rawData);

describe("verify partial update PATCH booking API end point", function () {
  let bookingId;
  let original;
  let token;
  this.timeout(10000);

  before(async () => {
    console.log("Running before hook for PATCH booking tests");
    // Fetching token
    token = await getAuthToken();
    // Creating a new booking
    const bookingPayloadJson = await bookingPayload();
    const createRes = await createBooking(bookingPayloadJson);
    expect(createRes.status).to.equal(200);
    bookingId = createRes.data.bookingid;
    // Verify the created booking
    const fetch = await getBooking(bookingId);
    expect(fetch.status).to.equal(200);
    original = fetch.data;
  });

  // Run dynamic patch scenarios from JSON
  patchScenarios.forEach((scenario) => {
    it(`Verify patch API when ${scenario.name}`, async () => {
      let requestBody = scenario.body;
      const response = await patchBooking(
        bookingId,
        requestBody,
        token
      );
      expect(response.status).to.equal(200);

      // Verify patched fields updated correctly
      for (const key of Object.keys(requestBody)) {
        expect(response.data[key]).to.equal(requestBody[key]);
      }
    });
  });

  // Verify that non-updated fields remain unchanged
  it("verify that not updated fields remain unchanged", async () => {
    const response = await getBooking(bookingId);
    expect(response.status).to.equal(200);

    // Compare unchanged fields with original
    const unchangedFields = ["firstname", "totalprice", "depositpaid", "bookingdates", "additionalneeds"];
    unchangedFields.forEach((field) => {
      if (!patchScenarios[0].body[field]) { // assuming first scenario for demonstration
        expect(response.data[field]).to.deep.equal(original[field]);
      }
    });
  });

  // Negative test cases
  it("verify error handling for partial update booking API", async () => {
    // Invalid booking ID
    await patchBooking(999999, { lastname: "Test" }, token)
      .then(() => { throw new Error("Expected 404 or 405 for non-existent booking"); })
      .catch((err) => {
        // Accept either 404 or 405 depending on API behavior
        expect([404, 405]).to.include(err.response.status);
      });

    // Missing authentication
    await patchBooking(bookingId, { lastname: "NoAuth" }, "")
      .then(() => { throw new Error("Expected 403 for missing auth"); })
      .catch((err) => {
        expect(err.response.status).to.equal(403);
      });

    // Invalid data type
    await patchBooking(bookingId, { totalprice: "InvalidType" }, token)
      .then(() => { throw new Error("Expected 400 for invalid data type"); })
      .catch((err) => {
        expect([400, 422]).to.include(err.response.status);
      });
  });

  // Verify idempotency
  it("verify idempotency of updates", async () => {
    const patchBody = { lastname: "Idempotent" };
    const firstUpdate = await patchBooking(bookingId, patchBody, token);
    expect(firstUpdate.status).to.equal(200);
    const secondUpdate = await patchBooking(bookingId, patchBody, token);
    expect(secondUpdate.status).to.equal(200);

    // Verify data remains consistent
    expect(secondUpdate.data.lastname).to.equal("Idempotent");
  });

  // include negative scenarios (additional scenarios can be added here)
});

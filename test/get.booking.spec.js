import { getBookings, getBooking } from "../utils/apiMethods.js";
import { expect } from "chai";
import { readFile } from "fs/promises";
import axios from "axios";

// Load JSON test data dynamically
const rawData = await readFile(
  new URL("../testData/getBookingFilter.json", import.meta.url)
);
const filterData = JSON.parse(rawData);

describe("verify the GET booking API end point", () => {
  const filters = filterData.filters;
  const invalidDate = filterData.invalidDate;
  const invalidParameter = filterData.invalidParameter;

  it("verify retrieve all booking IDs without filters", async () => {
    await getBookings().then(function (response) {
      // handle success
      console.log(response.status, response.data); // Optional: Debug log
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      expect(response.data.length).to.be.greaterThan(0);
    });
  });

  // single and combining multiple filters
  filters.forEach((filter) => {
    it(`verify booking API filters for ${JSON.stringify(
      filter.name
    )}`, async () => {
      const response = await getBookings({ params: filter.params });
      console.log(response.status, response.data); // Optional debug
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      // Add more assertions depending on expected behavior
    });
  });

  // include negative scenarios
  it("verify error handling for booking API - invalidDateFormat", async () => {
    const response = await getBookings({ params: invalidDate });
    console.log(response.status, response.data); // Optional debug
    expect([200, 400]).to.include(response.status);
  });
  // getting 500 response when bookings with invalid date format
  // no error for invalid date like 2025-02-31

  it("verify error handling for booking API - invalidParameterValue", async () => {
    const response = await getBookings({ params: invalidParameter });
    console.log(response.status, response.data); // Optional debug
    expect([200, 400]).to.include(response.status);
    expect(response.data.length).to.be.equals(0);
  });
  // response is 200 with empty array

  it("Verify response structure and data types", async () => {
    const response = await getBookings();
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an("array");
    expect(response.data.length).to.be.greaterThan(0);

    // Validate structure for each booking
    response.data.forEach((booking) => {
      // Usually the /booking endpoint returns an object like { bookingid: 123 }
      expect(booking).to.have.property("bookingid");
      expect(booking.bookingid).to.be.a("number");
    });
  });

  //negative scenarios
  it("Verify for invalid request payload API should return 400", async () => {
  const response = await getBookings({ data: { invalidKey: true } }); // Sending unexpected payload
  expect(response.status).to.be.equal(400); // Depending on API spec
  });
  //this test is failing as API is returning 200

  it("Verify SQL injection attempts", async () => {
  const sqlPayload = "'; DROP TABLE bookings; --";
  const response = await getBookings({ params: { firstname: sqlPayload } });
  expect(response.status).to.not.equal(500); // Should not crash
  });

});

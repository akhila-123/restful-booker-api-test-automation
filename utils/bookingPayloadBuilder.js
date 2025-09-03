export async function bookingPayload( extrafields = {}) {
  const base = {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 123,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-01',
      checkout: '2025-01-05'
    },
    additionalneeds: 'Breakfast'
  };
  return { ...base, ...extrafields };
}
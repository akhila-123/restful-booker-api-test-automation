import { apiRequest } from "./apiClient.js";

export async function createBooking(payload) {
    console.log('Inside creare booking method')
    console.log(payload)
  return apiRequest.post('/booking', payload, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }});
}

export async function getBooking(id) {
  return apiRequest.get(`/booking/${id}`,{headers: { 'Accept': 'application/json' }});
}

export async function getBookings(params = {}) {
  return apiRequest.get('/booking', { params });
}

export async function patchBooking(id, patchBody, token) {
  return apiRequest.patch(`/booking/${id}`, patchBody, {
    //headers: { Cookie: cookie, 'Content-Type': 'application/json' }
    headers: {
          Cookie: `token=${token}`,
          //'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM=',
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
  });
}

export async function deleteBooking(id, token) {
  return apiRequest.delete(`/booking/${id}`, {
     headers: {
          Cookie: `token=${token}`,
          //'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM=',
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
  });
}

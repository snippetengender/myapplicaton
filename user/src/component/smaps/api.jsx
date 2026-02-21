import api from "../../providers/api";

export async function fetchAllEventLocations() {
  const res = await api.get(`/smaps`);
  return res.data;
}

export async function fetchAllEventLocationsOfUser() {
  const res = await api.get(`/smaps/user`);
  return res.data;
}

export async function fetchEventsByCategory(category) {
  const res = await api.get(`/smaps/by-category/${category}`);
  return res.data;
}

export async function fetchEventById(eventId) {

  const res = await api.get(`/smaps/${eventId}`);
  return res.data;
}

export async function searchColleges(name, city = '') {
  const res = await api.get(`/college?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}`);
  return res.data;
}

export async function createEvent(payload) {
  const res = await api.post(`/smaps`, payload);
  return res.data;
}

export async function fetchUserCollegeLocation() {
  const res = await api.get(`/smaps/user/college-location`);
  return res.data;
}


export const formatTimestamp = (timeString) => {
  if (!timeString) return { date: '', s_time: '' };
  const dateObj = new Date(timeString);
  return {
    date: dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }),
    time: dateObj.toLocaleDateString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  };
};
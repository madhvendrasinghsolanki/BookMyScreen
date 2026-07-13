export const formatReleaseDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.toLocaleString("en-IN", { day: "2-digit" });
  const month = date.toLocaleString("en-IN", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const formatedTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const yyyy = today.getFullYear();
  const formattedDate = `${dd}-${mm}-${yyyy}`;
  return formattedDate;
};

export const seatTypePrices = {
  PREMIUM: 510,
  EXECUTIVE: 290,
  NORMAL: 180,
};

export const getSeatType = (seatId) => {
  const row = seatId?.charAt(0);
  if (row === "E") return "PREMIUM";
  if (["B", "C", "D"].includes(row)) return "EXECUTIVE";
  if (row === "A") return "NORMAL";
  return "UNKNOWN";
};

export const groupSeatsByType = (seats) => {
  const grouped = {};

  seats.forEach((seatId) => {
    const type = getSeatType(seatId);
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(seatId);
  });

  return Object.entries(grouped).map(([type, seats]) => ({ type, seats }));
};

export const calculateTotalPrice = (seats) => {
  const base = seats.reduce((acc, seatId) => {
    const type = getSeatType(seatId);
    const price = seatTypePrices[type] || 0;
    return acc + price;
  }, 0);
  const tax = +(base * 0.05).toFixed(2); // 5% tax
  const total = +(base + tax).toFixed(2);
  return { base, tax, total };
};

// True only when the request never reached the server (offline, DNS failure,
// CORS block, timeout, server down). A response that came back with a 4xx/5xx
// means the server was reachable and rejected the request for a real reason —
// that should be shown to the user, never silently treated as "offline".
export const isNetworkError = (error) => !error?.response

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.message || fallback

// Local fallback bookings — used when the backend is unreachable so the
// booking flow never leaves the user stuck without a confirmation.
const LOCAL_BOOKINGS_KEY = "bms-local-bookings";

export const getLocalBookings = (userId) => {
  try {
    const raw = window.localStorage.getItem(LOCAL_BOOKINGS_KEY);
    const all = raw ? JSON.parse(raw) : [];
    return userId ? all.filter((item) => String(item.user) === String(userId)) : all;
  } catch {
    return [];
  }
};

export const saveLocalBooking = (payload) => {
  const booking = {
    ...payload,
    _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
    offline: true,
  };
  try {
    const raw = window.localStorage.getItem(LOCAL_BOOKINGS_KEY);
    const all = raw ? JSON.parse(raw) : [];
    all.unshift(booking);
    window.localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(all));
  } catch {
    // ignore storage errors, still return the booking so the UI can proceed
  }
  return booking;
};

// Local fallback wishlist — used when the backend is unreachable so the
// heart button and the wishlist page still work end-to-end offline.
const LOCAL_WISHLIST_KEY = "bms-local-wishlist";

export const getLocalWishlist = (userId) => {
  try {
    const raw = window.localStorage.getItem(LOCAL_WISHLIST_KEY);
    const all = raw ? JSON.parse(raw) : [];
    return userId ? all.filter((item) => String(item.user) === String(userId)) : all;
  } catch {
    return [];
  }
};

export const addLocalWishlist = ({ user, movieTitle, posterUrl }) => {
  try {
    const raw = window.localStorage.getItem(LOCAL_WISHLIST_KEY);
    const all = raw ? JSON.parse(raw) : [];
    const existing = all.find((item) => String(item.user) === String(user) && item.movieTitle === movieTitle);
    if (existing) return existing;
    const item = {
      _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      user,
      movieTitle,
      posterUrl,
      offline: true,
    };
    all.unshift(item);
    window.localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(all));
    return item;
  } catch {
    return null;
  }
};

export const removeLocalWishlist = (id) => {
  try {
    const raw = window.localStorage.getItem(LOCAL_WISHLIST_KEY);
    const all = raw ? JSON.parse(raw) : [];
    window.localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(all.filter((item) => item._id !== id)));
  } catch {
    // ignore storage errors
  }
};

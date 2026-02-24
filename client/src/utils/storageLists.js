const CART_KEY = "toms_cart";
const WISHLIST_KEY = "toms_wishlist";

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function addToCart(item) {
  const cart = read(CART_KEY);
  const exists = cart.some((x) => x.id === item.id);
  const next = exists ? cart : [...cart, item];
  write(CART_KEY, next);
  return next;
}

export function toggleWishlist(item) {
  const list = read(WISHLIST_KEY);
  const exists = list.some((x) => x.id === item.id);
  const next = exists ? list.filter((x) => x.id !== item.id) : [...list, item];
  write(WISHLIST_KEY, next);
  return next;
}

export function isInWishlist(id) {
  return read(WISHLIST_KEY).some((x) => x.id === id);
}
export default function calcTotalPrice(cart) {
  return cart.reduce((acc, curr) => {
    if (!curr.product) return acc; // Products can be deleted but can still be in your cart.
    return acc + curr.quantity * curr.product.price;
  }, 0);
}

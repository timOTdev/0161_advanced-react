import { KeystoneContext } from '@keystone-next/types';
import Stripe from 'stripe';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

interface Arguments {
  token: string;
}

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Verify signed in.
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You have to be signed in to create an order!');
  }
  // 1.5 Query the current user.
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });
  console.dir(user, { depth: null });
  // 2. Calculate total price for order.
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function (
    acc: number,
    curr: CartItemCreateInput
  ) {
    return acc + curr.quantity * curr.product.price;
  },
  0);
  console.log(amount);

  // 3. Create the charge with the stripe library.
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.error(err);
      throw new Error(err.message);
    });

  console.log(charge);
  // 4. Convert cartItems to orderItems.
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    };

    return orderItem;
  });

  // 5. Create the order and return it.
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });

  // 6. Clean up any old cart item.
  const cartItemIds = user.cart.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });

  return order;
}

export default checkout;

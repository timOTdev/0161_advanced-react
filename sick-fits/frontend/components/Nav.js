import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';
import SignOut from './SignOut';
import { useCart } from '../lib/cartState';

export default function Nav() {
  const user = useUser();
  const { openCart } = useCart();

  return (
    <NavStyles>
      <Link href='/products'>Products</Link>
      {/* If user is logged in. */}
      {user && (
        <>
          <Link href='/sell'>Sell</Link>
          <Link href='/orders'>Orders</Link>
          <Link href='/account'>Count</Link>
          <SignOut />
          <button type='button' onClick={openCart}>
            My Cart
          </button>
        </>
      )}
      {/* If not logged in... */}
      {!user && (
        <>
          <Link href='/signin'>Sign In</Link>
        </>
      )}
    </NavStyles>
  );
}

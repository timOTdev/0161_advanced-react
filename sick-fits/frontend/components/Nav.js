import Link from "next/link";
import NavStyles from './styles/NavStyles';
import { useUser } from "./User";
import SignOut from './SignOut'

export default function Nav() {
  const user = useUser();
  return (
		<NavStyles>
			<Link href="/products">Products</Link>
			{/* If user is logged in. */}
			{user && (
				<>
					<Link href="/sell">Sell</Link>
					<Link href="/orders">Orders</Link>
					<Link href="/account">Count</Link>
					<SignOut />
				</>
			)}
			{/* If not logged in... */}
			{!user && (
				<>
					<Link href="/signin">Sign In</Link>
				</>
			)}
		</NavStyles>
	);
}

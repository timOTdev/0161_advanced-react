import { useUser } from './User';
import SignIn from './SignIn';

export default function ({ children }) {
  const signedIn = useUser();
  if (!signedIn) return <SignIn />;
  return children;
}

import { cookies } from 'next/headers';
import { auth } from '../lib/auth';

export default async function Home() {
  const cookieStore = await cookies();
  const loggedIn = Boolean(cookieStore.get(auth.manager.cookieName));

  return (
    <div>
      <h1>Next.js middleware example</h1>
      {loggedIn ? (
        <>
          <a href="/account">Account</a> | <a href="/logout">Logout</a>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}

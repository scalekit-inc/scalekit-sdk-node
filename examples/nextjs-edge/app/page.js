import { auth } from '../lib/auth';

export default async function Home() {
  const user = await auth.currentUser();

  return (
    <div>
      <h1>Next.js Edge Runtime middleware example</h1>
      {user ? (
        <>
          <a href="/account">Account</a> | <a href="/logout">Logout</a>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * NextAuth Configuration
 * Handles authentication and session management
 */
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' }
      },
      async authorize(credentials) {
        if (credentials?.username) {
          return { id: '1', name: credentials.username };
        }
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' }
});

export { handler as GET, handler as POST };
export default handler;
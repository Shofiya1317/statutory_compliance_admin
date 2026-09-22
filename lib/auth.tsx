/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { IUser } from './interface/IUser.interface';
import { AuthService, UserService } from './service';
import { getUserData } from './utils';

export const {
  handlers, auth, signIn, signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign_in',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'Eg. john@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Eg: P@ssword',
        },
      },
      authorize: async (credentials: any) => {
        try {
          const res = await AuthService.signIn({
            email: credentials?.email,
            password: credentials?.password,
          });
          const {
            success,
            access_token: accessToken,
            error,
          } = res?.data as unknown as {
            success: boolean;
            access_token: string;
            error: string[];
          };

          const userRes = await UserService.getCurrentUser(accessToken);
          if (!success || !accessToken) {
            throw new Error(error?.[0] || 'Login failed');
          }
          const { success: userSuccess, user } = userRes?.data as unknown as {
            success: boolean;
            user: IUser;
          };

          if (userSuccess && user) {
            return {
              ...getUserData({ user }).user,
              accessToken,
            };
          }

          return null;
        } catch (err: any) {
          console.error('Error during authentication:', err);
          throw new Error(err || 'Login failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      const newToken = { ...token };
      if (user) {
        newToken.accessToken = user.accessToken;
        newToken.user = user;
      }
      return newToken;
    },
    async session({ session, token }: any) {
      const newSession = { ...session };
      newSession.user = token.user;
      if (token.backendData) {
        newSession.backendData = token.backendData;
      }
      return { ...session, ...newSession };
    },
  },
  debug: true,
});

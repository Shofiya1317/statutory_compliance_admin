'use client';

import { IUser } from '@/lib/interface/IUser.interface';
import { UserService } from '@/lib/service';
import React, {
  ReactNode, useCallback, useMemo, useState,
} from 'react';

export interface UserContextProp {
  getCurrentUser: () => Promise<{
    user: IUser;
  } | null>;
  currentUser: IUser | undefined;
}
export interface UserProviderProps {
  children: ReactNode;
}

const UserContext = React.createContext<UserContextProp | null>(null);

function UserProvider({ children }: Readonly<UserProviderProps>) {
  const [currentUser, setCurrentUser] = useState<IUser>();

  const getCurrentUser = useCallback(async () => {
    const res = await UserService.getCurrentUser();
    const { user, success } = res?.data as {
      user: IUser;
      success: boolean;
    };
    if (success) {
      setCurrentUser(user);
      return { user };
    }
    return null;
  }, []);

  const value: UserContextProp = useMemo(
    () => ({
      getCurrentUser,
      currentUser,
    }),
    [getCurrentUser, currentUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

const useUser = () => React.useContext(UserContext);
export { UserProvider, useUser };

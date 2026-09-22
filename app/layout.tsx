import ClientProvider from '@/components/ClientProvider/ClientProvider';
import Header, { IMenuItem, IProfileItem } from '@/components/header/header';
import { ModalProvider } from '@/components/Modal/Context';
import { UserProvider } from '@/context/userProvider';
import { auth } from '@/lib/auth';
import { profileMenu, rootMenu } from '@/lib/config/root_menu';
import 'bootstrap/dist/css/bootstrap.min.css';
import { headers } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-phone-number-input/style.css';
import './styles.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const headersList = headers();
  const headerUrl = headersList.get('x-url') || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const url: any = headerUrl ? new URL(headerUrl) : '';

  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="./favicon.ico" />
        <title>Rubicr: admin</title>
      </head>
      <body id="bodybg">
        <ModalProvider>
          <UserProvider>
            <ClientProvider>
              {session
              && !url?.pathname?.includes('/accept_invitation')
              && !url?.pathname?.includes('/reset_password') ? (
                <>
                  <Header
                    menuItems={rootMenu as IMenuItem[]}
                    profileMenu={profileMenu as IProfileItem[]}
                  />
                  <div className="bg_section">
                    <div className="container-fluid p-0">
                      <div
                        className="table-section p-3"
                        style={{
                          background: '#EBF5F7',
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  </div>
                </>
                ) : (
                  children
                )}
              <Toaster
                position="top-right"
                gutter={8}
                toastOptions={{
                  success: {
                    duration: 3000,
                    style: {
                      background: 'green',
                      color: 'white',
                    },
                  },
                  error: {
                    duration: 5000,
                    style: {
                      background: 'red',
                      color: 'white',
                    },
                  },
                }}
              />
            </ClientProvider>
          </UserProvider>
        </ModalProvider>
      </body>
    </html>
  );
}

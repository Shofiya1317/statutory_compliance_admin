/* eslint-disable react/no-unused-prop-types */
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';
import { isMobile } from 'react-device-detect';
import logo from '../../assests/rubicr-logo.svg';
import adminleftImg from './Admin Login img 01.png';
import adminrightImg from './Admin Login img 02.png';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  title?: string;
  subTitle?: string;
  children: ReactElement;
  classname?: string;
}

function LeftPanel({ title, subTitle, children }: AuthLayoutProps) {
  return (
    <div
      className={`d-flex flex-column px-md-5 justify-content-between ${styles.login_flow}`}
    >
      <div className="d-flex flex-column align-items-flex-start flex-grow-1">
        <div className="d-flex align-items-start justify-content-start pt-5 pb-md-3">
          <Image src={logo} alt="logo" width={130} priority />
        </div>
        <div className="d-flex flex-column mt-3">
          {title && (
            <h2
              className={`d-flex align-items-start justify-content-start fw-bold  ${styles.head_title}`}
            >
              {title}
            </h2>
          )}
          {subTitle && (
            <div
              className={`d-flex align-items-start justify-content-start ${styles.head_description}`}
            >
              {subTitle}
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
      <div className=" d-flex justify-content-between align-items-center pt-4 pb-5">
        <div className={`fw-light ${styles.footer_terms}`}>
          <Link
            href={{ pathname: '/terms' }}
            className={`text-decoration-none ${styles.footer_terms}`}
          >
            Terms and Conditions
          </Link>
          {' | '}
          <Link
            href={{ pathname: '/privacy' }}
            className={`text-decoration-none ${styles.footer_terms}`}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

function AuthLayout({
  children,
  title,
  subTitle,
  classname = '',
}: AuthLayoutProps) {
  return (
    <div
      className={` container-fluid   ${styles.admin_bg_image} ${classname} `}
      style={{ minHeight: isMobile ? '85vh' : '100vh' }}
    >
      <div className={`${styles.rightImg}`}>
        <Image src={adminrightImg} alt="rightImg" width={400} priority />
      </div>
      <div className={styles.center_panel}>
        <div className={classname}>
          <div>
            <LeftPanel title={title} subTitle={subTitle}>
              {children}
            </LeftPanel>
          </div>
        </div>
      </div>

      <div className={`${styles.left_img}`}>
        <Image src={adminleftImg} alt="letfimg" width={400} priority />
      </div>
    </div>
  );
}

export default AuthLayout;

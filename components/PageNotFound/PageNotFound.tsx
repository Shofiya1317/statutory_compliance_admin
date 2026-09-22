/* eslint-disable no-nested-ternary */
import Image from 'next/image';
import PageNotFoundImgAdmin from './Admin.png';
import errorImg404 from './Page not found.png';

export default function PageNotFound({
  isAccessDenied = false,
  isMessageShow = true,
  isImageShow = true,
  message,
}: {
  isAccessDenied?: boolean;
  isMessageShow?: boolean;
  isImageShow?: boolean;
  message?: string;
}) {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={isImageShow ? { minHeight: '70vh' } : { minHeight: '41vh' }}
    >
      <div className={isImageShow ? ' errorImg404' : ''}>
        {isImageShow
          && (isAccessDenied ? (
            <Image src={errorImg404} alt="logo2" />
          ) : (
            <Image src={PageNotFoundImgAdmin} alt="logo1" />
          ))}
      </div>
      {isMessageShow && (
        <h4
          className="w-100 d-flex justify-content-center flex-column align-items-center"
          style={{ color: '#305B61' }}
        >
          {message
            || (isAccessDenied
              ? "You can't access this page right now. Please reach out to Admin."
              : 'No data found')}
        </h4>
      )}
    </div>
  );
}

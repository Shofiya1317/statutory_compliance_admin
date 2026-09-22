'use client';

import { useUser } from '@/context/userProvider';
import { IUser } from '@/lib/interface/IUser.interface';
import { UserService } from '@/lib/service';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import Avatar from 'react-avatar';
import toast from 'react-hot-toast';
import addPhoto from './add-photo.png';
import deletee from './delete.png';

export interface ChangeAvatarProps {
  user: IUser;
}

export default function ChangeAvatar({ user }: ChangeAvatarProps) {
  const router = useRouter();
  const context = useUser();
  const uploadProfilePicture = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await UserService?.uploadAvator(formData);
      const { success, error } = response?.data as {
        success: boolean;
        error: string[];
      };
      if (success) {
        toast.success('Avatar updated successfully');
        router.refresh();
        context?.getCurrentUser();
      } else {
        toast.error(error[0]);
      }
    }
  };

  const deleteProfileAttachment = async () => {
    const response = await UserService?.deleteAvatar();
    const { success, error } = response?.data as {
      success: boolean;
      error: string[];
    };
    if (success) {
      toast.success('Avatar deleted successfully');
      router.refresh();
      context?.getCurrentUser();
    } else {
      toast.error(error[0]);
    }
  };

  return (
    <div className=" py-4">
      <div className=" px-5 pb-4  d-flex  justify-content-center align-items-center flex-column">
        <div className="d-flex justify-content-center ">
          <Avatar
            name={user?.first_name}
            size="80"
            className="avatarImgRound"
            src={user?.avatar_url || ''}
          />
        </div>
        <div className="d-flex justify-content-center mt-3">
          <div>
            <div className=" d-flex">
              <div className="position-relative ">
                <span className=" curser-pointer">
                  <Image src={addPhoto} alt="delete" width={24} />
                </span>
                <input
                  type="file"
                  className="file-input curser-pointer"
                  accept="image/*"
                  onChange={uploadProfilePicture}
                />
              </div>
              {user?.avatar_url && (
                <span
                  aria-hidden
                  className="ms-2 curser-pointer"
                  onClick={deleteProfileAttachment}
                >
                  <Image src={deletee} alt="delete" width={24} />
                </span>
              )}
            </div>
          </div>
        </div>
        <h4 className="text-center m-0 mt-4 " style={{ color: '#8F8F8F' }}>
          {`${user?.first_name} ${user?.last_name}`}
        </h4>
        <p className="text-center" style={{ color: '#8F8F8F' }}>
          {user?.email}
        </p>
        <span
          className="  px-3 py-1 rounded-4"
          style={{ background: '#499da91a', color: '#305B61' }}
        >
          {user?.role?.name}
        </span>
      </div>
    </div>
  );
}

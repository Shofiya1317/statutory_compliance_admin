/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

'use client';

import { useRouter } from 'next/navigation';
import { GoUpload } from 'react-icons/go';
import AddorEditAccount from '../AddorEditAccount/AddorEditAccount';
import AddorEditUser from '../AddorEditUser/AddorEditUser';
import Button from '../Button/Button';
import FileUploader from '../MasterList/FileUploader/FileUploader';
import AddorEditIndicators from '../MasterList/Indicators/AddorEditIndicators';
import AddorEditIndusties from '../MasterList/Industries/AddorEditIndusties';
import AddorEditModules from '../MasterList/Modules/AddorEditModules';
import AddOrEditQuestion from '../MasterList/Question/AddOrEditQuestion';
import AddorEditSector from '../MasterList/Sector/AddorEditSector';
import AddorEditStandards from '../MasterList/Standards/AddorEditStandards';
import AddOrEditThemesIndustries from '../MasterList/ThemesIndustries/AddOrEditThemesIndustries';
import { useModal } from '../Modal/Context';
import AddOrEditFileRepo from '../MasterList/FileRepo/AddOrEditFileRepo';
// import AddorEditSubIndicators from '../MasterList/SubIndicators/AddorEditSubIndicators';
// import AddorEditDepartment from '../MasterList/Department/AddorEditDepartment';
// import AddOrEditWidgets from '../MasterList/Widgets/AddOrEditWidgets';
// import AddOrEditDashboardWidgets from '../DashboardWidgets/AddOrEditDashboardWidgets';

export default function InviteButton({
  btnName,
  isUpload = false,
}: {
  btnName: string;
  isUpload?: boolean;
}) {
  const router = useRouter();
  const hideModal = useModal({});
  const closeModal = () => {
    router.refresh();
    hideModal();
  };
  // eslint-disable-next-line react/no-unstable-nested-components
  function RenderComponents() {
    switch (btnName) {
      case 'User':
        return (
          <AddorEditUser
            actionType="Invite"
            onClose={closeModal}
            currentUser={undefined}
          />
        );
      case 'Account':
        return <AddorEditAccount onClose={closeModal} actionType="Invite" />;
      case 'Industries':
        return <AddorEditIndusties actionType="Create" onClose={closeModal} />;
      case 'Sectors':
        return <AddorEditSector actionType="Create" onClose={closeModal} />;
      case 'Standards':
        return <AddorEditStandards actionType="Create" onClose={closeModal} />;
      case 'Themes':
        return <AddorEditModules actionType="Create" onClose={closeModal} />;
      case 'Themes Industries':
        return (
          <AddOrEditThemesIndustries actionType="Create" onClose={closeModal} />
        );
      case 'Indicators':
        return <AddorEditIndicators actionType="Create" onClose={closeModal} />;
      case 'Questions':
        return <AddOrEditQuestion actionType="Create" onClose={closeModal} />;
      case 'File Repo':
        return <AddOrEditFileRepo actionType="Create" onClose={closeModal} />;
      default:
        return <div>Access no provided</div>;
    }
  }

  const buttonName = () => {
    switch (btnName) {
      case 'User':
      case 'Account':
        return 'Invite';
      default:
        return 'Create';
    }
  };

  const modal = useModal({
    style: {
      size: isUpload || btnName === 'Questions' ? 'lg' : 'sm',
      title: isUpload ? undefined : `${buttonName()} ${btnName}`,
      onClose: isUpload ? () => closeModal() : undefined,
    },
    content: isUpload ? (
      <FileUploader btnName={btnName} onClose={closeModal} />
    ) : (
      RenderComponents()
    ),
  });

  return (
    <Button
      className={`mb-2 btn-sm px-sm-4 ${isUpload ? 'Cancelbtn' : 'savebtn'}`}
      onClick={() => modal()}
    >
      {isUpload ? (
        <div>
          <span className="me-2">
            <GoUpload />
          </span>
          <span>{`Upload ${btnName}`}</span>
        </div>
      ) : (
        `+ ${buttonName()} ${btnName}`
      )}
    </Button>
  );
}

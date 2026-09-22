import Button from '@/components/Button/Button';
import { IndustryService, QuestionService, SectorService } from '@/lib/service';
import { downloadErrors } from '@/lib/utils';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import './FileUploader.css';
import { useRouter } from 'next/navigation';

export default function FileUploader({
  btnName,
  onClose,
}: {
  btnName: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const handleImportErrors = (errors: any[]) => {
  //   if (!errors || errors.length === 0) return;
  //   const formattedErrors = errors
  //     .map((item, index) => {
  //       const questionTitle = item.row?.['Question Title'] || 'Unknown Question';
  //       return `${index + 1}. ${questionTitle}: ${item.error}`;
  //     })
  //     .join('\n');

  //   if (formattedErrors.length < 1000) {
  //     toast.error(`Import failed:\n${formattedErrors}`, {
  //       duration: 8000,
  //       style: { whiteSpace: 'pre-wrap' },
  //     });
  //   } else {
  //     downloadErrors(errors);
  //     toast.error('Import failed. Errors has been downloaded.');
  //   }
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toastMessage = (res: any) => {
    console.error(res?.data, 'res?.data');

    const {
      errors, success, message, details,
    } = res?.data as {
      errors: string[];
      success: boolean;
      message: string;
      details: {
        errors: string[];
      };
    };
    if (!errors && success) {
      toast.success(`${message}`);
      onClose();
    } else if (!success && message) {
      toast.error(message);
      downloadErrors(details?.errors);
    } else {
      downloadErrors(errors);
    }
    router.refresh();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setFileName(selectedFile.name);
      let res;
      switch (btnName) {
        case 'Industries':
          res = await IndustryService.uploadIndustry(formData);
          break;
        case 'Sectors':
          res = await SectorService.uploadSector(formData);
          break;
        case 'Questions':
          res = await QuestionService.uploadQuestions(formData);
          break;
        default:
          break;
      }
      toastMessage(res);
    }
  };

  return (
    <div className="card">
      <h3>Upload Files</h3>
      <div className="drop_box">
        {!fileName ? (
          <>
            <header>
              <h4>Select File here</h4>
            </header>
            <p>Files Supported: XLS, XLSX</p>
            <input
              type="file"
              hidden
              accept=".xls,.xlsx"
              id="fileID"
              onChange={handleFileChange}
            />
            <Button
              className="mb-2 btn-sm px-sm-4 savebtn"
              onClick={() => document.getElementById('fileID')?.click()}
            >
              Choose File
            </Button>
          </>
        ) : (
          <form action="" method="post">
            <div className="form">
              <h4>{fileName}</h4>
              <Button disabled className="mb-2 btn-sm px-sm-4 savebtn">
                Uploaded
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

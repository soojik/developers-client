import React, { useState } from 'react';
import AWS from 'aws-sdk';

const S3_BUCKET = "developers-attach-test";
const REGION = "ap-northeast-2";

AWS.config.update({
    accessKeyId: "AKIA3LOAVHJ6JM4T5PHS",
    secretAccessKey: "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",
});

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
});

interface S3Select {
    s3select: (value: string) => void;
  uploadCheck: (uploadCheck: boolean) => void;
}

const AwsS3: React.FC<S3Select> = ({ s3select, uploadCheck }) => {
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');
    const [uploadClick, setUploadClick] = useState(false);

    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
            const currentDate = new Date();
            const timestamp = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}`;
            const fileNameWithTimestamp = `${timestamp}_${event.target.files[0].name}`;
            const objectUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileNameWithTimestamp}`;
            setUploadedFileUrl(objectUrl);
            s3select(objectUrl);
            uploadCheck(true)
        }
    };

    const uploadFile = (file: File) => {
        const currentDate = new Date();
        const timestamp = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}`;
        const fileNameWithTimestamp = `${timestamp}_${file.name}`;

        const params: AWS.S3.PutObjectRequest = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: fileNameWithTimestamp,
            
        };
        
        myBucket
            .putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100));
            })
            .send((err) => {
                if (err) {
                    console.log(err);
                } else {
                    window.alert("파일 업로드를 완료하였습니다.")
                    uploadCheck(false);
                    console.log(uploadCheck);
                }
            });

    };

    // const handleSubmit = () => {
    //     if (selectedFile) {
    //         s3select(uploadedFileUrl);
    //     }
    //   };
    

    
    return (
        <div>
            <div className='rounded border border-gray-400 p-4'>
                <div>파일 업로드 진행 상황: {progress}%</div>
                <input className="py-1 px-1 bg-transparent  font-semibold border border-gray-600 rounded hover:bg-gray-400 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 text-xs"
                    type="file" onChange={handleFileInput} />

                <button
                    className="py-1 px-1 bg-transparent text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 text-xs"
                    onClick={() => {
                        console.log("Upload button clicked");
                        selectedFile && uploadFile(selectedFile);
                    }}> 
                    파일 업로드
                </button>
              
                <div>
                    {/* <input
                        className="py-1 px-1 bg-transparent  font-semibold border border-gray-600 rounded text-xs"
                        type="text"
                        value={uploadedFileUrl}
                        readOnly
                    /> */}
                    {/* <button 
                        className="py-1 px-1 bg-transparent text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 text-xs"
                        onClick={handleSubmit}
                    >
                        저장
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default AwsS3;

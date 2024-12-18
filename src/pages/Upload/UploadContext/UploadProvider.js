import { createContext, useCallback, useRef, useState } from 'react';

const UploadContext = createContext();

function UploadProvider({ children }) {
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const inputVideoRef = useRef();
    const [uploadedFile, setUploadedFile] = useState({});
    const [textProgress, setTextProgress] = useState(null);
    const [percent, setPercent] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isReplace, setIsReplace] = useState(false);
    const [fileOld, setFileOld] = useState(null);

    const handleClick = () => {
        if (inputVideoRef.current) {
            inputVideoRef.current.click();
        }
    };

    const handleChange = useCallback(() => {
        const file = inputVideoRef.current?.files[0];
        let replace = true;

        if (file) {
            setFileOld(file);
        }

        if (file !== undefined && file !== fileOld) {
            replace = false;
            setIsReplace(false);
        }

        if (file && !replace) {
            const videoUrl = URL.createObjectURL(file);
            const elmVideo = document.createElement('video');
            elmVideo.src = videoUrl;

            setPercent(0);

            var formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'my_video_tiktok_uploaded_preset');
            formData.append('folder', 'my-video-tiktok-uploaded');

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.cloudinary.com/v1_1/dnummyvqk/video/upload');
            xhr.upload.addEventListener('progress', progressHandler, false);
            xhr.addEventListener('load', successHandler, false);
            xhr.addEventListener('error', errorHandler, false);

            elmVideo.onloadedmetadata = () => {
                const drt = elmVideo.duration;
                const minutes = Math.floor(drt / 60);
                const seconds = Math.floor(drt % 60);
                const myDrt = `${minutes}m ${seconds}s`;

                const mySize = Number(file.size / (1024 * 1024)).toFixed(2) + ' MB';

                setUploadedFile({
                    file,
                    duration: myDrt,
                    size: mySize,
                });
            };

            xhr.send(formData);
            setIsShowModalEdit(true);
            setIsSuccess(false);

            inputVideoRef.current.value = null;
        }
    }, [inputVideoRef, fileOld]);

    const progressHandler = (e) => {
        const mbLoaded = Number(e.loaded / (1024 * 1024)).toFixed(2) + ' MB';
        const size = Number(e.total / (1024 * 1024)).toFixed(2) + ' MB';
        const myPercent = Number((e.loaded / e.total) * 100).toFixed(0);
        setPercent(myPercent);

        // Tính tốc độ tải lên (Upload Speed)
        const uploadSpeed = e.loaded / (e.timeStamp / 1000); // (bytes per second)

        // Tính thời gian còn lại (Remaining time)
        const remainingBytes = e.total - e.loaded; // Dữ liệu còn lại cần tải lên
        const remainingTime = remainingBytes / uploadSpeed; // Thời gian còn lại tính bằng giây
        const remainingTimeInSeconds = Math.floor(remainingTime); // Lấy phần nguyên của thời gian còn lại

        // Chuyển đổi giây thành phút và giây
        const hoursRemaining = Math.floor(remainingTimeInSeconds / 3600);
        const minutesRemaining = Math.floor((remainingTimeInSeconds % 3600) / 60);
        const secondsRemaining = remainingTimeInSeconds % 60;

        const hours = hoursRemaining + 'h';
        const minutes = minutesRemaining + 'm';
        const seconds = secondsRemaining + 's left';

        setTextProgress(
            `${mbLoaded}/${size} uploaded... ${hoursRemaining > 0 ? hours : ''}  ${minutesRemaining > 0 ? minutes : ''} ${secondsRemaining > 0 ? seconds : ''}`,
        );
    };

    const successHandler = () => {
        setIsSuccess(true);
    };

    const errorHandler = () => {
        setIsError(true);
    };

    const value = {
        isShowModalEdit,
        inputVideoRef,
        uploadedFile,
        handleClick,
        handleChange,
        textProgress,
        percent,
        isSuccess,
        isError,
        setIsReplace,
        isReplace,
    };
    return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}

export { UploadContext };
export default UploadProvider;

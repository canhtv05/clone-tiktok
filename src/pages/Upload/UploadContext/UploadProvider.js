import { createContext, useRef, useState } from 'react';

const UploadContext = createContext();

function UploadProvider({ children }) {
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const inputVideoRef = useRef();
    const [uploadedFile, setUploadedFile] = useState({});
    const [textProgress, setTextProgress] = useState(null);
    const [percent, setPercent] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClick = () => {
        inputVideoRef.current.click();
    };

    const handleChange = () => {
        const file = inputVideoRef.current?.files[0];
        if (file) {
            const videoUrl = URL.createObjectURL(file);
            const elmVideo = document.createElement('video');
            elmVideo.src = videoUrl;

            var formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'my_video_tiktok_uploaded_preset');
            formData.append('folder', 'my-video-tiktok-uploaded');

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.cloudinary.com/v1_1/dnummyvqk/video/upload');
            xhr.upload.addEventListener('progress', progressHandler, false);
            xhr.addEventListener('load', successHandler, false);
            // xhr.addEventListener('error', ErrorHandler, false);

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
        }
    };

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
        const minutesRemaining = Math.floor(remainingTimeInSeconds / 60) + 'm';
        const secondsRemaining = (remainingTimeInSeconds % 60) + 's left';

        setTextProgress(
            `${mbLoaded}/${size} uploaded... ${minutesRemaining > 0 ? minutesRemaining : ''} ${secondsRemaining > 0 ? secondsRemaining : ''}`,
        );
    };

    const successHandler = () => {
        setIsSuccess(true);
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
    };
    return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}

export { UploadContext };
export default UploadProvider;

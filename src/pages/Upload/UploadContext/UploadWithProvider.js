import Upload from '../Upload';
import UploadProvider from './UploadProvider';

function UploadWithProvider() {
    return (
        <UploadProvider>
            <Upload />
        </UploadProvider>
    );
}

export default UploadWithProvider;

import React from 'react';
import Modal from '../Modal';
import Video from '~/pages/Video';

function VideoModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Video />
        </Modal>
    );
}

export default VideoModal;

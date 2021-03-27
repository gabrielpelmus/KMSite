import { useState } from 'react'
import Modal from './Modal';

export function useModal(props) {
    const [showModal, setShowModal] = useState(false);

    function openModal() {
        setShowModal(true);
    }

    function handleDismiss() {
        setShowModal(false);
    }

    return {
        Modal,
        modalProps: {
            show: showModal,
            onDismiss: handleDismiss,
            ...props,
        },
        openModal
    }
}

export default Modal;
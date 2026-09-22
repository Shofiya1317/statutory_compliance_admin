import { useEffect, useState } from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import './Modal.css';
import { ModalProps } from '../types';

export function Modal({
  show = false,
  onHide,
  title,
  children,
  className = '',
  size = 'sm',
  fullscreen,
  onClose,
}: ModalProps) {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    setModalShow(show);
  }, [show]);

  return (
    <BootstrapModal
      show={modalShow}
      onHide={() => {
        setModalShow(false);
        if (onHide) onHide();
        if (onClose) onClose();
      }}
      centered
      className={className}
      fullscreen={fullscreen}
      size={size}
      keyboard={false}
      backdrop="static"
      data-testid="close-button"
    >
      {(title || !!onClose) && (
        <BootstrapModal.Header
          data-testid="close-button"
          closeButton={!!onClose}
        >
          {title && (
            <BootstrapModal.Title data-testid="Test Title">
              {title}
            </BootstrapModal.Title>
          )}
        </BootstrapModal.Header>
      )}
      <BootstrapModal.Body data-testid="Test Content">
        {children}
      </BootstrapModal.Body>
    </BootstrapModal>
  );
}

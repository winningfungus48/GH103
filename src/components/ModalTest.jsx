import React, { useState } from 'react';
import Modal from './ui/Modal';

const ModalTest = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Modal Test Component</h2>
      <button onClick={() => setIsOpen(true)}>
        Open Test Modal
      </button>
      
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Test Modal"
        buttons={
          <button onClick={() => setIsOpen(false)}>
            Close
          </button>
        }
      >
        <p>This is a test modal to verify the Modal component works correctly.</p>
      </Modal>
    </div>
  );
};

export default ModalTest; 
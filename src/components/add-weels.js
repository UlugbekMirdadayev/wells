import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export default function AddWells() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>

      <Button onClick={open}>
        <IconPlus size={16} /> {"Quduq qo'shish"}
      </Button>
    </>
  );
}

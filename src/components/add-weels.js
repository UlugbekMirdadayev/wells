import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from '@mantine/form';
import { Modal, Button, Group, TextInput, NumberInput } from '@mantine/core';

export default function AddWells() {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: '',
      job: '',
      email: '',
      favoriteColor: '',
      age: 18
    },

    validate: {
      name: hasLength({ min: 2, max: 10 }, 'Name must be 2-10 characters long'),
      job: isNotEmpty('Enter your current job'),
      email: isEmail('Invalid email'),
      favoriteColor: matches(/^#([0-9a-f]{3}){1,2}$/, 'Enter a valid hex color'),
      age: isInRange({ min: 18, max: 99 }, 'You must be 18-99 years old to register')
    }
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication" centered>
        <form onSubmit={form.onSubmit}>
          <TextInput label="Name" placeholder="Name" error withAsterisk {...form.getInputProps('name')} />
          <TextInput label="Your job" placeholder="Your job" withAsterisk mt="md" {...form.getInputProps('job')} />
          <TextInput label="Your email" placeholder="Your email" withAsterisk mt="md" {...form.getInputProps('email')} />
          <TextInput
            label="Your favorite color"
            placeholder="Your favorite color"
            withAsterisk
            mt="md"
            {...form.getInputProps('favoriteColor')}
          />
          <NumberInput label="Your age" placeholder="Your age" withAsterisk mt="md" {...form.getInputProps('age')} />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>

      <Button onClick={open}>
        <IconPlus size={16} /> {"Quduq qo'shish"}
      </Button>
    </>
  );
}

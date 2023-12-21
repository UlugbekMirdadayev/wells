import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Box, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { sendBotMessage } from 'utils';
// import { useLocation } from 'react-router-dom';

export default function RequestModal() {
  // const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  function sendMessage(url) {
    setLoading(true);

    axios({
      method: 'get',
      url
    })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          close();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err, '---');
      });
  }

  const onSubmit = ({ phone, name }) => {
    sendMessage(sendBotMessage({ phone, name, site: location.origin || window.location.origin }));
  };
  function Form() {
    const form = useForm({
      initialValues: {
        phone: '998996572600',
        name: 'Ulugbek Mirdadayev'
      },

      validate: {
        phone: (value) => (String(value)?.length === 12 ? false : 'Raqam xato kiritlgan')
      }
    });

    return (
      <Box maw={340} mx="auto">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <NumberInput
            label="Telefon raqamingizni qoldiring"
            style={{ marginTop: 20 }}
            placeholder="Hide controls"
            {...form.getInputProps('phone')}
            hideControls
          />
          <TextInput label="Ismingiz" mt={'lg'} {...form.getInputProps('name')} />
          <Group justify="flex-end" mt="md">
            <Button loading={loading} type="submit">
              Ariza qoldirish
            </Button>
          </Group>
        </form>
      </Box>
    );
  }
  return (
    <>
      <Modal opened={opened} onClose={close} title="Ariza qoldirish" centered>
        <Form />
      </Modal>
      <Button onClick={open} variant="gradient" gradient={{ deg: 133, from: 'blue', to: 'cyan' }} size="lg" radius="md" mt="xl">
        Ariza qoldirish
      </Button>
    </>
  );
}

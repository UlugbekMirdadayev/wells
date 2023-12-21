import { useState, useRef, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Box, NumberInput, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { sendBotMessage } from 'utils';

export default function RequestModal() {
  const phoneInput = useRef(null);
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

  const onSubmit = ({ phone, name, comment }) => {
    sendMessage(sendBotMessage({ phone, name, site: location.origin || window.location.origin, comment }));
  };
  function Form() {
    const form = useForm({
      initialValues: {
        phone: '998',
        name: '',
        comment: ''
      },

      validate: {
        phone: (value) => (String(value)?.length === 12 ? false : 'Raqam xato kiritlgan')
      }
    });

    return (
      <Box maw={340} mx="auto">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <NumberInput
            ref={phoneInput}
            label="Telefon raqamingizni qoldiring"
            style={{ marginTop: 20 }}
            placeholder="Hide controls"
            {...form.getInputProps('phone')}
            hideControls
          />
          <TextInput label="Ismingiz" mt={'lg'} {...form.getInputProps('name')} />
          <Textarea maxLength={50} label="Murojaatingizni shu joyga yozib qoldiring" mt={'lg'} {...form.getInputProps('comment')} />
          <Group justify="flex-end" mt="md">
            <Button loading={loading} type="submit">
              Ariza qoldirish
            </Button>
          </Group>
        </form>
      </Box>
    );
  }

  useEffect(() => {
    if (opened) {
      setTimeout(() => phoneInput.current?.focus(), 300);
    }
  }, [phoneInput, opened]);
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

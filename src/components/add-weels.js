/* eslint-disable react/prop-types */
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { Modal, Button, TextInput, Group } from '@mantine/core';
import { getWells, wellCreate, wellUpdate } from 'api';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/loading';
import { setWells } from 'redux/wells';
import { toast } from 'react-toastify';

export default function AddWells({ initialValues, id = null, onClose }) {
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues
  });
  const setValue = form.setValues;
  useEffect(() => {
    if (id) {
      open();
      setValue(initialValues);
    }
  }, [initialValues, id, open, setValue]);

  const getData = useCallback(() => {
    dispatch(setLoading(true));
    getWells()
      .then(({ data }) => {
        dispatch(setLoading(false));
        dispatch(setWells(data));
        close();
      })
      .catch(({ message }) => {
        dispatch(setLoading(false));
        console.log(message);
      });
  }, [dispatch, close]);

  const onSubmit = (values) => {
    dispatch(setLoading(true));
    if (id) {
      wellUpdate(id, values)
        .then(({ data }) => {
          console.log(data);
          getData();
        })
        .catch((err) => {
          toast.error(err.message || 'Xatolik');
          dispatch(setLoading(false));
          console.log(err);
        });
    } else {
      wellCreate(values)
        .then(({ data }) => {
          console.log(data);
          getData();
          toast.success(data.message);
        })
        .catch((err) => {
          toast.error(err.message || 'Xatolik');
          dispatch(setLoading(false));
          console.log(err);
        });
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          id && onClose();
        }}
        title={`Quduq${id ? 'ni yangilash' : ' yaratish'} `}
        centered
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput label="Nomi" placeholder="Nomi" m={'md'} {...form.getInputProps('name')} />
          <TextInput label="Telefon raqami" m={'md'} required withAsterisk placeholder="Telefon raqami" {...form.getInputProps('number')} />
          <TextInput label="Manzil" placeholder="address" m={'md'} {...form.getInputProps('address')} />
          <TextInput label="Latitude" placeholder="latitude" m={'md'} {...form.getInputProps('latitude')} />
          <TextInput label="Longitude" placeholder="longitude" m={'md'} {...form.getInputProps('longitude')} />
          <Group justify="flex-end">
            <Button type="submit">{"Jo'natish"}</Button>
          </Group>
        </form>
      </Modal>

      {id ? null : (
        <Button onClick={open}>
          <IconPlus size={16} /> {"Quduq qo'shish"}
        </Button>
      )}
    </>
  );
}

/* eslint-disable react/prop-types */
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { Modal, Button, TextInput, Group, Tooltip } from '@mantine/core';
import { getWells, wellCreate, wellUpdate } from 'api';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/loading';
import { setWells } from 'redux/wells';
import { toast } from 'react-toastify';
import { sendEditedWells } from 'utils';
import { useUser } from 'redux/selectors';
import { sendMessage } from './request-modal';

export default function AddWells({ initialValues, id = null, onClose }) {
  const user = useUser();
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: '',
      number: '',
      address: '',
      latitude: '',
      longitude: ''
    },
    validate: {
      number: (value) => ([9, 12].includes(value?.length) ? undefined : "Telefon raqami formati noto'g'ri")
    }
  });
  const setValue = form.setValues;
  useEffect(() => {
    if (id) {
      open();
      setValue({
        name: initialValues?.name,
        number: initialValues?.number,
        address: initialValues?.address,
        latitude: initialValues?.latitude,
        longitude: initialValues?.longitude
      });
    }
  }, [initialValues, id, open, setValue]);

  const noEditedForm = useMemo(
    () =>
      Boolean(
        !Object.keys(form.values).filter((item) => {
          return initialValues?.[item]?.trimEnd() !== form.values?.[item]?.trimEnd();
        }).length
      ),
    [form.values, initialValues]
  );

  const getData = useCallback(() => {
    dispatch(setLoading(true));
    getWells()
      .then(({ data }) => {
        dispatch(setLoading(false));
        dispatch(setWells(data));
        close();
        onClose && onClose();
      })
      .catch(({ message }) => {
        dispatch(setLoading(false));
        console.log(message);
      });
  }, [dispatch, close, onClose]);

  const onSubmit = (values) => {
    dispatch(setLoading(true));
    if (id) {
      wellUpdate(id, values)
        .then(({ data }) => {
          console.log(data);
          sendMessage(
            sendEditedWells({
              adminId: user?.user_id,
              adminName: user?.name,
              phone: values?.number,
              wellName: values?.name,
              wellId: initialValues?.well_id
            }),
            setLoading,
            close
          );
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
        opened={opened || !!id}
        onClose={() => {
          close();
          id && onClose();
        }}
        title={`Quduq${id ? 'ni yangilash' : ' yaratish'} `}
        centered
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput label="Nomi" placeholder="Nomi" m={'md'} {...form.getInputProps('name')} />
          <TextInput
            label="Telefon raqami"
            type="number"
            m={'md'}
            withAsterisk
            placeholder="Telefon raqami"
            {...form.getInputProps('number')}
          />
          <TextInput label="Manzil" placeholder="address" m={'md'} {...form.getInputProps('address')} />
          <TextInput label="Latitude" placeholder="latitude" m={'md'} {...form.getInputProps('latitude')} />
          <TextInput label="Longitude" placeholder="longitude" m={'md'} {...form.getInputProps('longitude')} />
          <Group justify="flex-end">
            <Tooltip color={noEditedForm ? 'red ' : 'blue'} label={noEditedForm ? "O'zgarish kiritilmagan" : 'Yuborish'}>
              <Button disabled={noEditedForm} type="submit">
                {"Jo'natish"}
              </Button>
            </Tooltip>
          </Group>
        </form>
      </Modal>

      {onClose ? null : (
        <Button onClick={open}>
          <IconPlus size={16} /> {"Quduq qo'shish"}
        </Button>
      )}
    </>
  );
}

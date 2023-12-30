import { useCallback, useInsertionEffect, useState } from 'react';
import {
  Avatar,
  Table,
  Group,
  Text,
  ActionIcon,
  Menu,
  rem,
  ScrollArea,
  Title,
  Select,
  Modal,
  Button,
  TextInput,
  PasswordInput,
  Loader
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconArrowBackUp, IconUserPlus, IconLogout, IconChevronRight } from '@tabler/icons-react';
import { useLoading, useUser, useUsers } from 'redux/selectors';
import { useDispatch } from 'react-redux';
import { setUsers } from 'redux/users';
import { createUser, getUsers, updateUser, updateUserStatus, userDelete } from 'api';
import { toast } from 'react-toastify';
import { setLoading } from 'redux/loading';
import { setUser } from 'redux/user';
import { NotFound } from 'screens/404';

const rolesData = [
  { value: 'true', label: 'SuperAdmin' },
  { value: 'false', label: 'Nazoratchi' }
];

export default function ProfileSuperUser() {
  const dispatch = useDispatch();
  const user = useUser();
  const loading = useLoading();
  const [opened, { open, close }] = useDisclosure(false);
  const [editForm, setEditForm] = useState({ open: false });
  const users = useUsers();

  const getAllUsers = useCallback(() => {
    dispatch(setLoading(true));
    getUsers()
      .then(({ data }) => dispatch(setUsers(data)))
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      })
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  useInsertionEffect(() => {
    if (users?.length) return undefined;
    getAllUsers();
  }, [getAllUsers, users?.length]);

  const isUser = (item) => user.user_id === item.user_id;

  const handleUpdateUserStatus = (value, user_id) => {
    console.log('====================================');
    console.log(value);
    console.log('====================================');
    updateUserStatus(user_id, value)
      .then(({ data }) => {
        getAllUsers();
        toast.success(data?.message || '✅');
        onClose();
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const deleteUser = (user_id) => {
    userDelete(user_id)
      .then(({ data }) => {
        getAllUsers();
        toast.success(data?.message || '✅');
        onClose();
        if (user?.user_id === user_id) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const rows = users
    .filter((user) => !isUser(user))
    .map((item, key) => (
      <Table.Tr key={item.name + key} bg={isUser(item) ? 'var(--mantine-color-dark-5)' : undefined}>
        <Table.Td>
          <Group gap="sm">
            <Avatar />
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.surname}</Table.Td>
        <Table.Td>{item.username}</Table.Td>
        <Table.Td>
          <Select
            data={rolesData}
            defaultValue={String(item.is_superuser)}
            onChange={(value) => handleUpdateUserStatus(value, item?.user_id)}
            variant="unstyled"
            allowDeselect={false}
          />
        </Table.Td>
        <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon variant="subtle" color="gray" onClick={() => setEditedForm(item)}>
              <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
              <Menu.Target disabled={isUser(item)}>
                <ActionIcon variant="subtle" color="gray">
                  <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item c={'green'} leftSection={<IconArrowBackUp style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                  {"Yo'q"}
                </Menu.Item>
                <Menu.Item
                  onClick={() => deleteUser(item?.user_id)}
                  c={'red'}
                  leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                >
                  Ha
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

  const form = useForm({
    initialValues: { username: '', password: '', name: '', surname: '' }
  });

  const setEditedForm = (user) => {
    form.setValues({
      username: user?.username,
      password: user?.password,
      name: user?.name,
      surname: user?.surname
    });
    setEditForm({ open: true, user });
    open();
  };

  const onClose = () => {
    close();
    setEditForm({ open: false });
    editForm.open && form.reset();
  };

  const onSubmit = (values) => {
    if (editForm?.user) {
      updateUser(editForm?.user?.user_id, values)
        .then(({ data }) => {
          getAllUsers();
          toast.success(data?.message || '✅');
          onClose();
          form.reset();
        })
        .catch((err) => {
          console.log('====================================');
          console.log(err);
          console.log('====================================');
        });
    } else {
      createUser(values)
        .then(({ data }) => {
          getAllUsers();
          toast.success(data?.message || '✅');
          onClose();
          form.reset();
        })
        .catch((err) => {
          console.log('====================================');
          console.log(err);
          console.log('====================================');
        });
    }
  };

  const logOut = () => {
    dispatch(setUser({}));
    localStorage.clear();
  };

  if (!user?.is_superuser) {
    return <NotFound />;
  }

  return (
    <>
      <Group align="center" justify="space-between">
        <Title c="dimmed" my={'md'}>
          {"Nazoratchilar ro'yxati"}
        </Title>
        <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
          <Menu.Target>
            <Group>
              <Avatar radius="xl" />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {`${user?.name} ${user?.surname}`}
                </Text>

                <Text c="dimmed" size="xs">
                  Super Admin
                </Text>
              </div>

              <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => setEditedForm(user)}
              leftSection={<IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            >
              Profilni yangilash
            </Menu.Item>
            <Menu.Item onClick={logOut} c={'lime'} leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
              Akkauntdan chiqish
            </Menu.Item>
            <Menu.Item
              onClick={() => deleteUser(user?.user_id)}
              c={'red'}
              leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            >
              {"Akkauntni butunlay o'chirish"}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Group m="lg" justify="flex-end">
        <Button onClick={open}>
          <IconUserPlus />
          <Text px={'md'}>Yangi nazoratchi tayinlash</Text>
        </Button>
      </Group>
      <ScrollArea maw={'calc(100dvw - 32px)'}>
        <Table.ScrollContainer minWidth={600} my={'md'}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ism</Table.Th>
                <Table.Th>Familiya</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Lavozim</Table.Th>
                <Table.Th ta={'right'}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td ta={'center'} colSpan={5}>
                    <Loader />
                  </Table.Td>
                </Table.Tr>
              ) : null}
              {rows.length ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text fw={500} ta="center">
                      Nazoratchilar topilmadi
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Modal
          opened={opened}
          onClose={onClose}
          title={
            user?.user_id === editForm.user?.user_id
              ? 'Profilni yangilash'
              : editForm.open
              ? "Nazoratchini ma'lumotini yangilash"
              : 'Yangi nazoratchi tayinlash'
          }
          centered
        >
          <form autoComplete="off" onSubmit={form.onSubmit(onSubmit)}>
            <TextInput mt={'md'} label="Ism" placeholder="ism" type="text" required {...form.getInputProps('name')} />
            <TextInput mt={'md'} label="Familiya" placeholder="surname" type="text" required {...form.getInputProps('surname')} />
            <TextInput mt={'md'} label="Username" placeholder="username" type="text" required {...form.getInputProps('username')} />
            {!editForm.open && (
              <PasswordInput mt={'md'} label="Parolingiz" placeholder="Parolingizni kiriting" {...form.getInputProps('password')} />
            )}
            <Button type="submit" fullWidth mt="xl">
              {user?.user_id === editForm.user?.user_id
                ? 'Profilni yangilash'
                : editForm.open
                ? "Nazoratchini ma'lumotini yangilash"
                : 'Yangi nazoratchi tayinlash'}
            </Button>
          </form>
        </Modal>
      </ScrollArea>
    </>
  );
}

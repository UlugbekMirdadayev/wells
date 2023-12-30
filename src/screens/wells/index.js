import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, ScrollArea, Text, TextInput, rem, keys, Loader, Center, Button, Menu } from '@mantine/core';
import { IconBrandGoogleMaps, IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import Th from './th';
import { useLoading, useWells } from 'redux/selectors';
import { getWells, wellDelete } from 'api';
import { useDispatch } from 'react-redux';
import { setLoading } from 'redux/loading';
import { toast } from 'react-toastify';
import AddWells from 'components/add-weels';
import { setWells } from 'redux/wells';

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) => keys(data[0]).some((key) => item[key].toLowerCase().includes(query)));
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

const openMap = (e, item) => {
  e.stopPropagation();
  const link = `https://www.google.com/maps/search/?api=1&query=${item?.latitude},${item?.longitude}`;
  window.open(link);
};

export default function Wells() {
  const dispatch = useDispatch();
  const loading = useLoading();
  const data = useWells();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [editModal, setEditModal] = useState({});
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const getData = useCallback(() => {
    dispatch(setLoading(true));
    getWells()
      .then(({ data }) => {
        dispatch(setLoading(false));
        dispatch(setWells(data));
      })
      .catch(({ message }) => {
        dispatch(setLoading(false));
        console.log(message);
      });
  }, [dispatch]);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const deleteWell = useCallback(
    (id) => {
      dispatch(setLoading(true));
      wellDelete(id)
        .then(({ data }) => {
          toast.success(data.message);
          dispatch(setLoading(false));
          getData();
        })
        .catch((err) => {
          toast.error(err.message || 'Xatolik');
          dispatch(setLoading(false));
        });
    },
    [dispatch, getData]
  );

  const rows = useMemo(
    () =>
      sortedData.map((row) => (
        <Table.Tr key={row?.well_id}>
          <Table.Td style={{ cursor: 'pointer' }} onClick={() => navigate(`/wells/${row?.well_id}`)}>
            {row.name}
          </Table.Td>
          <Table.Td>{row.level}</Table.Td>
          <Table.Td>{row.salting}</Table.Td>
          <Table.Td>{row.temperature}</Table.Td>

          <Table.Td style={{ cursor: 'pointer' }} onClick={(e) => openMap(e, row)}>
            <IconBrandGoogleMaps />
          </Table.Td>
          <Table.Td>
            <Button onClick={() => setEditModal(row)}>
              <IconEdit />
            </Button>
          </Table.Td>
          <Table.Td>
            <Menu position="right" openDelay={100} closeDelay={400}>
              <Menu.Target>
                <Button color="red">
                  <IconTrash />
                </Button>
              </Menu.Target>
              <Menu.Dropdown title="Ochirilsinmi">
                <Text px={'lg'} py={'xs'} fw={600}>
                  {"O'chirilsinmi"}
                </Text>
                <Menu.Item bg={'#ff00003d'} onClick={() => deleteWell(row?.well_id)}>
                  Ha
                </Menu.Item>
                <Menu.Item mt={'sm'} bg={'#00ff002f'}>
                  {"Yo'q"}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Table.Td>
        </Table.Tr>
      )),
    [sortedData, deleteWell, navigate]
  );

  return (
    <>
      <AddWells onClose={() => setEditModal({})} id={editModal?.well_id} initialValues={editModal} />
      <TextInput
        placeholder="Qidiruv barcha ma'lumotlar bo'yicha"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <ScrollArea maw={'calc(100dvw - 32px)'}>
          <Table
            withTableBorder
            withColumnBorders
            highlightOnHover
            withRowBorders
            horizontalSpacing="md"
            verticalSpacing="xs"
            miw={700}
            layout="fixed"
          >
            <Table.Tbody>
              <Table.Tr>
                <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>
                  Quduq nomi
                </Th>
                <Th sorted={sortBy === 'level'} reversed={reverseSortDirection} onSort={() => setSorting('level')}>
                  Suv yer sathidan
                </Th>
                <Th sorted={sortBy === 'salting'} reversed={reverseSortDirection} onSort={() => setSorting('salting')}>
                  {"Sho'rlanish darajasi"}
                </Th>
                <Th sorted={sortBy === 'temperature'} reversed={reverseSortDirection} onSort={() => setSorting('temperature')}>
                  Suv harorati
                </Th>
                <Th disabled>Joylashuvi</Th>
                <Th disabled>{"O'zgartirish"}</Th>
                <Th disabled>{"O'chirish"}</Th>
              </Table.Tr>
              <Table.Tr></Table.Tr>
            </Table.Tbody>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text fw={500} ta="center">
                      Quduqlar topilmadi
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </>
  );
}

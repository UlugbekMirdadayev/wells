import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, ScrollArea, Text, TextInput, rem, keys } from '@mantine/core';
import { IconBrandGoogleMaps, IconSearch } from '@tabler/icons-react';
import Th from './th';
import { useWells } from 'redux/selectors';

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

const openMap = (e, location) => {
  e.stopPropagation();
  window.open(location);
};

export default function Wells() {
  const data = useWells();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

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

  const rows = sortedData.map((row) => (
    <Table.Tr
      style={{ cursor: 'pointer' }}
      key={row.id}
      onClick={() => {
        console.log(row.level);
        navigate(`/wells/${row.id}`);
      }}
    >
      <Table.Td>{row.level}</Table.Td>
      <Table.Td>{row.salting}</Table.Td>
      <Table.Td>{row.temperature}</Table.Td>
      <Table.Td onClick={(e) => openMap(e, row.location)}>
        <IconBrandGoogleMaps />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TextInput
        placeholder="Qidiruv barcha ma'lumotlar bo'yicha"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
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
            </Table.Tr>
            <Table.Tr></Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text fw={500} ta="center">
                    Quduqlar topilmadi
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

import { useState } from 'react';
import { Autocomplete, Group, Burger, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import classes from './header.module.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const links = [
  { link: '/', label: 'Asosiy' },
  { link: '/wells', label: 'Quduqlar' },
  { link: '/login', label: 'Nazorat' }
];

export default function Header() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [value, setValue] = useState('');

  const items = links.map((link) => (
    <NavLink key={link.label} to={link.link} className={classes.link}>
      {link.label}
    </NavLink>
  ));

  const onSelect = (v) => {
    if (search?.replace('?', '') === v) return null;
    setValue(v);
    navigate(`/wells?${v}`);
  };

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <NavLink to={'/'} className={classes.link} style={{ padding: 0 }}>
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
            <p>Logo</p>
          </Group>
        </NavLink>

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
          <Autocomplete
            onChange={setValue}
            value={value}
            className={classes.search}
            placeholder="Izlash"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
            visibleFrom="xs"
            onOptionSubmit={onSelect}
          />
        </Group>
      </div>
    </header>
  );
}

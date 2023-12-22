import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Group, Burger, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser, useWells } from 'redux/selectors';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/user';
import { IconSearch } from '@tabler/icons-react';
import classes from './header.module.css';
import AddWells from 'components/add-weels';

export default function Header() {
  const dispatch = useDispatch();
  const options = useWells();
  const user = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    const storageData = localStorage['user-data-web-site-wells'] || '{}';
    const userLocale = JSON.parse(storageData);
    if (userLocale?.email) {
      dispatch(setUser(userLocale));
    }
  }, [dispatch]);

  const links = useMemo(
    () => [
      { link: '/', label: 'Asosiy' },
      { link: '/wells', label: 'Quduqlar' },
      user?.email ? { modal: true, link: '#', label: "Quduq qo'shish" } : { link: '/login', label: 'Nazorat' }
    ],
    [user?.email]
  );

  const items = links.map((link) => (
    <NavLink key={link.label} to={link.link} className={classes.link} onClick={close}>
      {link.modal ? <AddWells /> : link.label}
    </NavLink>
  ));
  const onSelect = (v) => {
    if (pathname?.split('/')?.at(-1) === v) return null;
    setValue(v);
    navigate(`/wells/${v}`);
    close();
  };

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <NavLink to={'/'} className={classes.link} style={{ padding: 0 }}>
            <p>Logo</p>
          </NavLink>
        </Group>

        <Group>
          <Group ml={50} gap={5} className={classes.links} opened={`${opened}`}>
            {items}
          </Group>
          <Autocomplete
            onChange={setValue}
            value={value}
            className={classes.search}
            placeholder="Izlash"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={options.map((well) => well?.id)}
            onOptionSubmit={onSelect}
          />
        </Group>
      </div>
    </header>
  );
}

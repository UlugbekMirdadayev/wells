import { useCallback, useEffect, useMemo, useState } from 'react';
import { Autocomplete, Group, Burger, rem, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser, useWells } from 'redux/selectors';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/user';
import { IconSearch } from '@tabler/icons-react';
import classes from './header.module.css';
import AddWells from 'components/add-weels';
import { getWells, me } from 'api';
import { setWells } from 'redux/wells';
import { setLoading } from 'redux/loading';

export default function Header() {
  const dispatch = useDispatch();
  const options = useWells();
  const user = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [value, setValue] = useState('');

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
    return () => {
      const storageData = localStorage['user-data-web-site-wells'];
      if (storageData) {
        me(storageData)
          .then(({ data }) => {
            dispatch(setUser(data));
          })
          .catch((err) => {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
          });
      }
      getData();
    };
  }, [dispatch, getData]);

  const links = useMemo(() => {
    const allLinks = [
      { link: '/', label: 'Asosiy' },
      { link: '/wells', label: 'Quduqlar' },
      user?.user_id
        ? user?.is_superuser
          ? { modal: false, link: '/profile', label: 'Profile' }
          : null
        : { link: '/login', label: 'Nazorat' }
    ];
    return allLinks.filter(Boolean);
  }, [user?.user_id, user?.is_superuser]);

  const items = links.map((link) => (
    <NavLink key={link.link} to={link.link} className={classes.link} onClick={close}>
      {link.label}
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
          <Text visibleFrom="sm" component="div">
            <NavLink to={'/'} className={classes.link} style={{ padding: 0 }}>
              <p>Sirdaryo Melio</p>
            </NavLink>
          </Text>
        </Group>
        <Text visibleFrom="sm">{user?.user_id ? <AddWells /> : null}</Text>
        <Group>
          <Group ml={50} gap={5} className={classes.links} opened={`${opened}`}>
            {items}
            <Text hiddenFrom="sm"> {user?.user_id ? <AddWells /> : null}</Text>
          </Group>
          <Autocomplete
            onChange={setValue}
            value={value}
            className={classes.search}
            placeholder="Izlash"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={options.map((well) => ({ label: well?.name, value: well?.well_id }))}
            onOptionSubmit={onSelect}
          />
        </Group>
      </div>
    </header>
  );
}

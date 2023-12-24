import { Container, Group, Text, Title } from '@mantine/core';
import classes from './footer.module.css';
import { Link } from 'react-router-dom';

const links = [
  { link: '/', label: 'Asosiy' },
  { link: '/wells', label: 'Quduqlar' }
];

export default function Footer() {
  const items = links.map((link) => (
    <Link key={link.label} to={link.link}>
      <Text td="none" c="dimmed" size="sm">
        {link.label}
      </Text>
    </Link>
  ));

  return (
    <Container size={'xl'} className={classes.footer}>
      <div className={classes.inner}>
        <Title size="md" c="dimmed">
          Sirdaryo Melio suv kurilish MCHJ <br /> © 2023 Tesla, Inc.
        </Title>
        <Group className={classes.links}>{items}</Group>
      </div>
    </Container>
  );
}

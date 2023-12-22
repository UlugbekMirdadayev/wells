import { useParams } from 'react-router-dom';
import { Paper, Group, rem, Text, Container } from '@mantine/core';
import { IconWaterpolo, IconTemperature, IconCookie } from '@tabler/icons-react';
import classes from './wells.module.css';
import { NotFound } from 'screens/404';
import { useWells } from 'redux/selectors';

const WellSingle = () => {
  const data = useWells();
  const { id } = useParams();
  const item = data.find((well) => well.id === id);
  if (!item?.level) return <NotFound />;
  const options = [
    { icon: IconWaterpolo, label: 'Suv yer sathidan', value: item.level },
    { icon: IconTemperature, label: 'Suv harorati', value: item.temperature },
    { icon: IconCookie, label: "Sho'rlanish darajasi", value: item.salting }
  ];

  const stats = options.map((well) => (
    <Paper className={classes.stat} radius="md" shadow="md" p="xs" key={well.label}>
      <well.icon style={{ width: rem(32), height: rem(32) }} className={classes.icon_} stroke={1.5} />
      <div>
        <Text className={classes.label}>{well.label}</Text>
        <Text fz="xs" className={classes.count}>
          <span className={classes.value}>{well.value}</span>
        </Text>
      </div>
    </Paper>
  ));

  return (
    <>
      <h1>{item.id}</h1>
      <Container size={'sm'} className={classes.root}>
        <Group style={{ flex: 1 }}>{stats}</Group>
      </Container>
      <iframe
        title={item.id}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.09823629923!2d71.6054635!3d41.001222999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb4b009b9e34c1%3A0xf4ee5dad5e4ec937!2s!5e0!3m2!1suz!2s!4v1703199882737!5m2!1suz!2s"
        className={classes.iframe}
        allowFullScreen
        loading="lazy"
      />
    </>
  );
};

export default WellSingle;

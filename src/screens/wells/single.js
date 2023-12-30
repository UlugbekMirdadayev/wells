import { useState, useInsertionEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Group, rem, Text, Loader } from '@mantine/core';
import { IconWaterpolo, IconTemperature, IconCookie } from '@tabler/icons-react';
import classes from './wells.module.css';
import { NotFound } from 'screens/404';
import { getStatistics, getWells } from 'api';
import { useLoading } from 'redux/selectors';

const WellSingle = () => {
  const loading = useLoading();
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [statistics, setStatistics] = useState([]);

  const getData = useCallback(() => {
    getWells(id)
      .then(({ data }) => {
        setItem(data);
      })
      .catch(({ message }) => {
        console.log(message);
      });
    getStatistics()
      .then(({ data }) => {
        setStatistics(data);
      })
      .catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  }, [id]);

  useInsertionEffect(() => {
    getData();
  }, [getData]);
  if (!item?.well_id) return loading ? <Loader /> : <NotFound />;
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
      <h1>{item?.name}</h1>

      <div className={classes.root}>
        <Group style={{ flex: 1 }}>{stats}</Group>
      </div>

      <iframe
        className={classes.iframe}
        title={item.name}
        loading="lazy"
        src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      />
      <Text>Statistika {JSON.stringify(statistics)}</Text>
    </>
  );
};

export default WellSingle;

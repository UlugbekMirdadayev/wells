import { useState, useLayoutEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Paper, Group, rem, Text, Loader, Button } from '@mantine/core';
import { IconWaterpolo, IconTemperature, IconCookie, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import classes from './wells.module.css';
import { NotFound } from 'screens/404';
import { getStatistics, getWells } from 'api';
import { useLoading, useStatistics } from 'redux/selectors';
import { setStatistics } from 'redux/statistics';
import moment from 'moment';

const WellSingle = () => {
  const dispatch = useDispatch();
  const statistics = useStatistics();
  const loading = useLoading();
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getData = useCallback(() => {
    setIsLoading(true);
    getWells(id)
      .then(({ data }) => {
        setIsLoading(false);
        setItem(data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [id]);

  const getStat = useCallback(() => {
    getStatistics()
      .then(({ data }) => {
        setIsLoading(false);
        dispatch(setStatistics(data));
      })
      .catch((err) => {
        setIsLoading(false);
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  }, [dispatch]);

  useLayoutEffect(() => {
    return () => {
      getData();
      getStat();
      return undefined;
    };
  }, [getData, getStat]);
  if (!item?.well_id) return loading ? <Loader /> : <NotFound />;
  const options = [
    { icon: IconWaterpolo, label: 'Suv yer sathidan', value: statistics[index]?.water_level },
    { icon: IconTemperature, label: 'Suv harorati', value: statistics[index]?.temperature },
    { icon: IconCookie, label: "Sho'rlanish darajasi", value: statistics[index]?.salinity }
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
      {isLoading ? (
        <Loader />
      ) : (
        <div className={classes.root}>
          <Group style={{ flex: 1 }}>
            <Group display={'grid'} ta={'center'} c={'#fff'}>
              <Button
                disabled={index + 1 === statistics?.length}
                color={'green'}
                onClick={() =>
                  setIndex((_index) => {
                    if (_index + 1 === statistics?.length) {
                      return _index;
                    }
                    return _index + 1;
                  })
                }
              >
                <IconArrowUp />
              </Button>
              <Text>{moment(statistics[index]?.time).format('DD/MM/YYYY')}</Text>
              <Text>{moment(statistics[index]?.time).format('HH:MM:SS')}</Text>
              <Button
                disabled={index === 0}
                color={'green'}
                onClick={() =>
                  setIndex((_index) => {
                    if (_index === 0) {
                      return _index;
                    }
                    return _index - 1;
                  })
                }
              >
                <IconArrowDown />
              </Button>
            </Group>
            {stats}
          </Group>
        </div>
      )}

      <iframe
        className={classes.iframe}
        title={item.name}
        loading="lazy"
        src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      />
    </>
  );
};

export default WellSingle;

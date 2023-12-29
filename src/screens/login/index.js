import { useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Paper, Title, Container, Button } from '@mantine/core';
import classes from './login.module.css';
import { setUser } from 'redux/user';
import { login, me } from 'api';
import { getFormData } from 'utils';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: { username: '', password: '' }
  });
  const onSubmit = (values) => {
    login(getFormData(values))
      .then(({ data: { access_token } }) => {
        me(access_token)
          .then(({ data }) => {
            dispatch(setUser(data));
            localStorage.setItem('user-data-web-site-wells', access_token);
            navigate('/wells');
          })
          .catch((err) => {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
          });
      })
      .catch(({ response: { data } } = { data: {} }) => {
        console.log('==============={err}=====================');
        console.log(data);
        console.log('==============={err}=====================');
      });
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Nazoratchilar uchun!
      </Title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Username" placeholder="ok@mail.co" type="text" required {...form.getInputProps('username')} />
          <PasswordInput label="Parolingiz" placeholder="Parolingizni kiriting" required mt="md" {...form.getInputProps('password')} />
          <Button type="submit" fullWidth mt="xl">
            Kirish
          </Button>
        </Paper>
      </form>
    </Container>
  );
}

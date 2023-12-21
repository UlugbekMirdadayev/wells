import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Paper, Title, Container, Button } from '@mantine/core';
import classes from './login.module.css';

export default function Login() {
  const form = useForm({
    initialValues: { email: '', password: '' }
  });
  const onSubmit = (values) => {
    console.log(values);
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Nazoratchilar uchun!
      </Title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="ok@mail.co" type="email" required {...form.getInputProps('email')} />
          <PasswordInput label="Parolingiz" placeholder="Parolingizni kiriting" required mt="md" {...form.getInputProps('password')} />
          <Button type="submit" fullWidth mt="xl">
            Kirish
          </Button>
        </Paper>
      </form>
    </Container>
  );
}

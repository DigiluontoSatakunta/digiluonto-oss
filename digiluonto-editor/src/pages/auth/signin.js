import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {gql, useMutation} from "@apollo/client";
import {useForm, Controller} from "react-hook-form";

import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import {useUser, AUTHENTICATE_USER_QUERY} from "../../hooks/user";

const LOGIN_MUTATION = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
    }
  }
`;

export default function SignIn() {
  const [foundErrors, setFoundErrors] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  const router = useRouter();
  const {user, loading} = useUser();

  const [checkUsernamePassword] = useMutation(LOGIN_MUTATION);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      identifier: "",
      password: "",
      provider: "local",
    },
  });

  const onSubmit = async data => {
    setFoundErrors(false);
    setSubmittingForm(true);
    await handleSubmitForm(data);
    setSubmittingForm(false);
  };

  const handleSubmitForm = async data => {
    const {identifier, password, provider} = data;

    try {
      const loggedInUser = await checkUsernamePassword({
        variables: {input: {identifier, password, provider}},
        refetchQueries: [{query: AUTHENTICATE_USER_QUERY}],
      });

      const token = loggedInUser?.data?.login?.jwt;

      if (token) {
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        setFoundErrors(true);
        localStorage.removeItem("token");
      }
    } catch (e) {
      setFoundErrors(true);
      localStorage.removeItem("token");
    }
  };

  if (loading) <>Loading...</>;

  // if user is signed in, redirect to home
  if (!loading && user) {
    router.push("/");
    return null;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "primary.main",
        background: "url(/login-background.jpg)",
        backgroundSize: "cover",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: "white",
          minHeight: "100vh",
          mr: "auto",
          ml: 0,
          pt: 8,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{m: 1, bgcolor: "primary.main"}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Kirjaudu sisään
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{mt: 1}}>
              {foundErrors && (
                <Box sx={{mt: 2}}>
                  <Alert severity="error">
                    Kirjautuminen epäonnistui. Tarkista sähköpostiosoite ja
                    salasana ja yritä uudelleen.
                  </Alert>
                </Box>
              )}
              <FormControl fullWidth={true}>
                <Controller
                  name="identifier"
                  control={control}
                  rules={{required: true}}
                  render={({field}) => (
                    <TextField
                      label="Sähköpostiosoite"
                      autoComplete="email"
                      name="identifier"
                      margin="normal"
                      fullWidth
                      autoFocus
                      error={errors.identifier ? true : false}
                      helperText={
                        errors.identifier
                          ? "Kirjautuaksi sinun täytyy antaa sähköpostiosoitteesi."
                          : null
                      }
                      {...field}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth={true}>
                <Controller
                  name="password"
                  control={control}
                  rules={{required: true}}
                  render={({field}) => (
                    <TextField
                      label="Salasana"
                      autoComplete="current-password"
                      name="password"
                      type="password"
                      margin="normal"
                      fullWidth
                      error={errors.password ? true : false}
                      helperText={
                        errors.password
                          ? "Kirjautuaksi sinun täytyy antaa salasanasi."
                          : null
                      }
                      {...field}
                    />
                  )}
                />
              </FormControl>

              <LoadingButton
                loading={submittingForm}
                variant="contained"
                type="submit"
                fullWidth
                sx={{mt: 3, mb: 2}}
              >
                Kirjaudu
              </LoadingButton>

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" sx={{textDecoration: "none"}}>
                    Unohditko salasanasi?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
}

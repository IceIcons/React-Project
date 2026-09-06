import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./Auth";
import CloseIcon from '@mui/icons-material/Close';

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
`;


function Register({ open }) {
  const { setAccessToken, setUser } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      email: ``,
      name: ``,
      password: ``,
    },
  });

  const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION);

  const onSubmit = (data) => {
    register({
      variables: data,
      onCompleted: handleRegisterCompleted,
      onError: (error) => toast.error(error.message),
    });
  };

  const handleRegisterCompleted = (data) => {
    toast.success(`Registered Succesfully!`);
    navigate(`/`);
    setAccessToken(data?.register?.accessToken);
    setUser(data?.register?.user);
  };

  const handleClose = (e) => {
    navigate(`/`);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '30px',
        },
      }}
    >
      <Stack spacing={2} className="register-content" sx={{ padding: 3 }}>
        <Stack direction={"row"} sx={{ justifyContent: `end` }}>
          <Link to={`/`}>
            <button style={{ cursor: `pointer`, border: `none`, backgroundColor: `transparent` }}>
              <CloseIcon />
            </button>
          </Link>
        </Stack>
        <DialogTitle>
          <Stack spacing={2} sx={{ justifyContent: `space-between`, alignItems: "center" }}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv_RJjot304oMZ8JkZIU4z5kdNV_glJ9HRfGpLabnaHA&s=10" alt="" width={`80px`} height={`40px`} />
            <Typography variant="h5" sx={{ fontWeight: `700`, fontFamily: `sans-serif` }}>
              Register
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent style={{ paddingTop: `6px` }}>
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: `Enter the Name!`,
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    inputRef={ref}
                    error={error}
                    label="Name"
                    helperText={error && error.message}
                    type="text"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />
                );
              }}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: `Enter the Email!`,
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    inputRef={ref}
                    error={error}
                    label="Email"
                    helperText={error && error.message}
                    type="email"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />
                );
              }}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                minLength: {
                  value: 10,
                  message: `Password Must Contain More Than 10 Characters!`,
                },
                required: `Enter the Password!`,
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    inputRef={ref}
                    error={error}
                    label="Password"
                    helperText={error && error.message}
                    type="password"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />
                );
              }}
            />
          </Stack>
        </DialogContent>
        <Stack direction={`row`} sx={{ alignItems: `center`, justifyContent: `center`, paddingRight: `24px`, paddingLeft: `24px`, paddingBottom: `24px` }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            color="error"
            size="large"
            sx={{ borderRadius: `12px`, fontWeight: `600`, }}
          >
            Continue
          </Button>
        </Stack>
        <p style={{ paddingRight: `24px`, paddingLeft: `24px`, paddingBottom: `24px` }}>
          Did you have an account?
          <Link to={`/login`}>
            <button style={{ border: `none`, backgroundColor: `transparent`, color: `blue`, cursor: `pointer`, fontWeight: `600` }}>Log In</button>
          </Link>
          to your account.
        </p>
      </Stack>
    </Dialog>
  );
}
export default Register;

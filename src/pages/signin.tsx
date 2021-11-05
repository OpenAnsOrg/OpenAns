import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button";
import * as yup from "yup";
import { useFormik } from "formik";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { authHandle } from "../firebase/client";

const SignIn = () => {
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$/,
        "Must Contain atleast 8 Characters and two numbers"
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log("Submitted");
      console.log(JSON.stringify(values));
      signInWithEmailAndPassword(authHandle, values.email, values.password)
        .then(() => window.location.replace("/"))
        .catch((error) => {
          alert(error.message);
        });
    },
    validationSchema: validationSchema,
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "70vh",
      }}
    >
      <Typography variant="h3">Sign In</Typography>
      <Box sx={{ minWidth: { sm: "20rem", md: "40rem" } }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Submitting");
            formik.handleSubmit();
          }}
          style={{
            display: "flex",
            flexDirection: "column",

            // border: "2px solid #ff3d00",
            // borderRadius: ".5rem",
            margin: "2rem",
            padding: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            onBlur={formik.handleBlur}
            sx={{ m: "1rem", maxWidth: "29rem" }}
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            onBlur={formik.handleBlur}
            sx={{ m: "1rem", maxWidth: "29rem" }}
            fullWidth
          />
          <Button
            variant="contained"
            sx={{ width: "15rem" }}
            type="submit"
            onClick={() => formik.handleSubmit()}
          >
            Sign In
          </Button>
        </form>
      </Box>
      <Typography variant="body1">
        Not a user? <Button href="/signup">Sign Up</Button>
      </Typography>
    </Box>
  );
};

export default SignIn;
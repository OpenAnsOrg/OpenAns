import { Box, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  authHandle,
  storeHandle,
  storageHandle,
} from "../firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  query,
  where,
  getDocs,
  collection
} from "firebase/firestore";
import { uploadBytes, ref } from "firebase/storage";
import { useState, useEffect } from "react";

const Signup = () => {
  const [image, setImage] = useState(null);
  const [emailInUse, setEmailInUse] = useState(false);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
    desc: yup.string().required("Description is required"),
    org: yup.string().required("Organization is required"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$/,
        "Must Contain atleast 8 Characters and two numbers"
      ),
    passwordConfirmation: yup
      .string()
      .required("Confirmation is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      desc: "",
      org: "",
      password: "",
      passwordConfirmation: "",
    },
    onSubmit: (values) => {
      console.log("Submitted");
      console.log(JSON.stringify(values));
      createUserWithEmailAndPassword(authHandle, values.email, values.password)
        .then((userCredential) => {
          const user = userCredential.user;
          (async () => {
            await setDoc(doc(storeHandle, "users", user.uid), {
              uid: user.uid,
              name: values.name,
              desc: values.desc,
              org: values.org,
              email: values.email,
              saved: [],
              answers: [],
              likes: [],
              groups: [],
              followers: [],
              following: []
            });
          })();

          window.location.replace("/");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    validationSchema: validationSchema,
  });

  useEffect(() => {
    (async () => {
      const usersRef = collection(storeHandle, "users");
      const q = query(usersRef, where("email", "==", formik.values.email));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data);
      });
      if (data.length !== 0) {
        setEmailInUse(true);
      } else {
        setEmailInUse(false);
      }
    })();
  }, [formik.values.email]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        mt:"1rem"
      }}
    >
      <Typography variant="h3">Sign Up</Typography>
      <Box sx={{ width: "90vw", maxWidth: { sm: "auto", md: "40rem" } }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Submitting");
            formik.handleSubmit();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "1rem",
            padding: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
            sx={{ m: "1rem", maxWidth: "29rem" }}
            fullWidth
          />
          
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
          {emailInUse ? (
            <Typography variant="caption">Email already in use</Typography>
          ) : null}
          <TextField
            id="desc"
            name="desc"
            label="Description"
            variant="outlined"
            value={formik.values.desc}
            onChange={formik.handleChange}
            error={formik.touched.desc && Boolean(formik.errors.desc)}
            helperText={formik.touched.desc && formik.errors.desc}
            onBlur={formik.handleBlur}
            sx={{ m: "1rem", maxWidth: "29rem" }}
            fullWidth
          />
          <TextField
            id="org"
            name="org"
            label="Organization"
            variant="outlined"
            value={formik.values.org}
            onChange={formik.handleChange}
            error={formik.touched.org && Boolean(formik.errors.org)}
            helperText={formik.touched.org && formik.errors.org}
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
          <TextField
            id="passwordConfirmation"
            name="passwordConfirmation"
            label="Password Confirmation"
            variant="outlined"
            type="password"
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            error={
              formik.touched.passwordConfirmation &&
              Boolean(formik.errors.passwordConfirmation)
            }
            helperText={
              formik.touched.passwordConfirmation &&
              formik.errors.passwordConfirmation
            }
            onBlur={formik.handleBlur}
            sx={{ m: "1rem", maxWidth: "29rem" }}
            fullWidth
          />
          {(emailInUse) ? (
            <Button
              variant="contained"
              sx={{ width: "12rem" }}
              type="submit"
              onClick={() => formik.handleSubmit()}
              disabled
            >
              Sign up
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ width: "12rem" }}
              type="submit"
              onClick={() => formik.handleSubmit()}
            >
              Sign up
            </Button>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default Signup;

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { authHandle, storeHandle, storageHandle } from "../../firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../../components/Loading";
import * as yup from "yup";
import { useFormik } from "formik";
import AddIcon from "@mui/icons-material/Add";
import { addDoc, collection, doc, setDoc, arrayUnion, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import moment from "moment"

const Create = () => {
  const [user, loading] = useAuthState(authHandle);
  const [program, setProgram] = useState(null);
  const [okFile, setOkFile] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    desc: yup.string().required("Description is required"),
    tags: yup.string().required("Tags is required"),
    functionName: yup.string().required("Exact function name is required"),
    numberOfVariables: yup.number().required("Number of variables is required"),
    variablesDesc: yup.string().required("Variable description is required"),
    exampleCall: yup.string().required("Example function call is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      desc: "",
      functionName: "",
      tags: "",
      numberOfVariables: 0,
      variablesDesc: "",
      exampleCall: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const userRef = doc(storeHandle, "users", user.uid);
      const userDataSnap = await getDoc(userRef);
      const userData = userDataSnap.data();
      const docid = user.uid + "" + Math.floor(Date.now() / 3000);
      let tags = values.tags.split(",");
      tags = tags.map((el) => el.trim());
      let title = values.title.split(" ");
      let titleStr = title.join("_").toLowerCase();
      tags = [...tags, titleStr];
      const docRef = await setDoc(doc(storeHandle, "answers", docid), {
        creatorid: user.uid,
        title: values.title,
        desc: values.desc,
        functionName: values.functionName,
        numberOfVariables: values.numberOfVariables,
        tags: tags,
        variablesDesc: values.variablesDesc,
        exampleCall: values.exampleCall,
        fileAdded: false,
        creatorName: userData.name,
        isPrivate: isPrivate,
        likes: [],
        comments: [],
        saves: [],
        createdAt: moment().unix(),
      });

      const storageRef = ref(storageHandle, `py_prgs/${docid}`);

      await uploadBytes(storageRef, program);
      const fileURL = await getDownloadURL(
        ref(storageHandle, `gs://openansorg.appspot.com/py_prgs/${docid}`)
      );
      await setDoc(
        doc(storeHandle, "answers", docid),
        {
          fileURL: fileURL,
        },
        { merge: true }
      );
      await setDoc(
        doc(storeHandle, "users", user.uid),
        {
          answers: Array.from(new Set([...userData.answers, docid])),
        },
        { merge: true }
      );
      window.location.replace(`/answers/${docid}`);
    },
  });
  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return (
      <Typography variant="h4" sx={{ my: "3rem", mx: "1rem" }}>
        You must be logged in to create answers
      </Typography>
    );
  }

  const handleProgChange = (e) => {
    if (e.target.files[0]) {
      const prog = e.target.files[0];
      if (prog?.type != "text/x-python") {
        alert("Upload only python files");
        return;
      }
      setProgram(prog);
      setOkFile(prog?.type == "text/x-python");
    }
  };

  return (
    <Box
      component="form"
      sx={{
        width: "70%",
        my: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      noValidate
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <Typography variant="h4">Create Answer</Typography>
      <TextField
        fullWidth
        id="title"
        name="title"
        label="Title"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        sx={{ my: "1rem" }}
        variant="outlined"
        autoFocus
      />
      <TextField
        fullWidth
        id="desc"
        name="desc"
        label="Description"
        value={formik.values.desc}
        onChange={formik.handleChange}
        error={formik.touched.desc && Boolean(formik.errors.desc)}
        helperText={formik.touched.desc && formik.errors.desc}
        sx={{ my: "1rem" }}
        variant="outlined"
        multiline
      />
      <TextField
        fullWidth
        id="tags"
        name="tags"
        label="Tags"
        value={formik.values.tags}
        onChange={formik.handleChange}
        error={formik.touched.tags && Boolean(formik.errors.tags)}
        helperText={formik.touched.tags && formik.errors.tags}
        sx={{ my: "1rem" }}
        variant="outlined"
      />
      <Typography variant="caption">
        Include keywords and topic for better search visibility
      </Typography>
      <TextField
        fullWidth
        id="functionName"
        name="functionName"
        label="Function Name"
        value={formik.values.functionName}
        onChange={formik.handleChange}
        error={
          formik.touched.functionName && Boolean(formik.errors.functionName)
        }
        helperText={formik.touched.functionName && formik.errors.functionName}
        sx={{ my: "1rem" }}
        variant="outlined"
        multiline
      />
      <TextField
        fullWidth
        id="numberOfVariables"
        name="numberOfVariables"
        label="Number Of Variables"
        value={formik.values.numberOfVariables}
        onChange={formik.handleChange}
        error={
          formik.touched.numberOfVariables &&
          Boolean(formik.errors.numberOfVariables)
        }
        helperText={
          formik.touched.numberOfVariables && formik.errors.numberOfVariables
        }
        sx={{ my: "1rem" }}
        variant="outlined"
        multiline
      />
      <TextField
        fullWidth
        id="variablesDesc"
        name="variablesDesc"
        label="Variables Description"
        value={formik.values.variablesDesc}
        onChange={formik.handleChange}
        error={
          formik.touched.variablesDesc && Boolean(formik.errors.variablesDesc)
        }
        helperText={formik.touched.variablesDesc && formik.errors.variablesDesc}
        sx={{ my: "1rem" }}
        variant="outlined"
        multiline
      />
      <TextField
        fullWidth
        id="exampleCall"
        name="exampleCall"
        label="Example Function Call"
        value={formik.values.exampleCall}
        onChange={formik.handleChange}
        error={formik.touched.exampleCall && Boolean(formik.errors.exampleCall)}
        helperText={formik.touched.exampleCall && formik.errors.exampleCall}
        sx={{ my: "1rem" }}
        variant="outlined"
        multiline
      />
      <Button variant="text" component="label" endIcon={<FileUploadIcon />} >
        Upload Program
        <input type="file" accept=".py" hidden onChange={handleProgChange} />
      </Button>
      <FormControlLabel control={<Checkbox checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />} label="Private?" />
      {okFile ? (
        <Button
          color="primary"
          variant="contained"
          type="submit"
          sx={{ my: "1rem" }}
          endIcon={<AddIcon />}
        >
          Create
        </Button>
      ) : (
        <Button
          color="primary"
          variant="contained"
          type="submit"
          sx={{ my: "1rem" }}
          endIcon={<AddIcon />}
          disabled
        >
          Create
        </Button>
      )}
    </Box>
  );
};

export default Create;

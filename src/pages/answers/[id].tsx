import { Typography, TextField, Box, Button, Container } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { storeHandle, storageHandle, authHandle } from "../../firebase/client";
import moment from "moment";
import Pyodide from "../../components/Pyodide";
import { useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import Highlight from "react-highlight.js";
import LikeSaveShare from "../../components/LikeSaveShare";
import Comments from "../../components/Comments";

function PostView({ data, content, id }) {
  const [call, setCall] = useState("");
  const [cont, setCont] = useState(content);
  if (!data) {
    return (
      <Box sx={{ my: "3rem" }}>
        <Typography variant="h4">Answer does not exist</Typography>
      </Box>
    );
  }
  const {
    title,
    desc,
    functionName,
    numberOfVariables,
    variablesDesc,
    exampleCall,
    fileURL,
  } = data;
  const handleCallChange = (e) => {
    setCall(e.target.value);
  };
  const handleCallSubmit = () => {
    setCont(cont + "\n" + call);
    // console.log(cont);
  };
  if (data.isPrivate && data.creatorid != authHandle.currentUser?.uid) {
    return (
      <Box sx={{ my: "3rem" }}>
        <Typography variant="h4">You do not have access to this answer</Typography>
      </Box>
    );
  }
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          my: "1rem",
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ my: "0.5rem" }}>
          {title.toUpperCase()}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="text"
            sx={{ width: "fit-content", fontWeight: "bold" }}
            href={"/profile/" + data.userid}
          >
            {data.creatorName}
          </Button>
          {data.isPrivate == false ? (<LikeSaveShare ansid={id} />) : null}
        </Box>
        <Typography variant="caption" sx={{ my: "1rem" }}>
          Created At: {moment.unix(data.createdAt).format("lll")}
        </Typography>
        <Typography variant="h6" sx={{ mt: ".5rem", fontWeight: "bold" }}>
          Tags:{" "}
        </Typography>
        <Typography variant="body1" sx={{ my: ".5rem" }}>
          {data.tags.filter(d => d != data.title.split(" ").join("_").toLowerCase()).join(", ")}
        </Typography>
        <Typography variant="h6" sx={{ mt: ".5rem", fontWeight: "bold" }}>
          Description:{" "}
        </Typography>
        <Typography variant="body1" sx={{ my: ".5rem" }}>
          {desc}
        </Typography>
        <Typography variant="h6" sx={{ mt: ".5rem", fontWeight: "bold" }}>
          Parameter Description:{" "}
        </Typography>
        <Typography variant="body1" sx={{ my: ".3rem" }}>
          {variablesDesc}
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCallSubmit();
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row", md: "row" },
              my: "1rem",
            }}
          >
            <TextField
              id="call"
              name="call"
              label="Function Call"
              value={call}
              onChange={handleCallChange}
              sx={{ my: "1rem", width: "100%" }}
              variant="outlined"
              placeholder={exampleCall}
              fullWidth
            />
            <Button
              variant="contained"
              sx={{ m: "1rem", minWidth: "150px", height: "100%" }}
              type="submit"
            >
              Run Program
            </Button>
          </Box>
        </form>
        <Box>
          <Pyodide pythonCode={cont} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ mt: "1rem", fontWeight: "bold" }}>
            Python Code:
          </Typography>
          <Button
            variant="text"
            onClick={() => {
              navigator.clipboard.writeText(content);
              window.alert("Copied to clipboard");
            }}
            sx={{ fontWeight: "bold" }}
          >
            Copy
          </Button>
        </Box>
        <Highlight language="python" style={{ fontWeight: 500 }}>
          {content || null}
        </Highlight>
        <Comments ansid={id} />
      </Box>
    </Container>
  );
}

export async function getServerSideProps({ resolvedUrl }) {
  const ansid = resolvedUrl.replace("/answers/", "");
  const docRef = doc(storeHandle, "answers", ansid);
  const docSnap = await getDoc(docRef);
  const pathReference = ref(storageHandle, `py_prgs/${ansid}`);
  const url = await getDownloadURL(pathReference);
  const response = await fetch(url);
  const content = (await response.text()) || null;
  // console.log(docSnap.data());
  return {
    props: {
      id: ansid,
      data: docSnap.data() || null,
      content: content,
    },
  };
}

export default PostView;

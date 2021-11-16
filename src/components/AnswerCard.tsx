import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import { useState, useEffect } from "react";
import { authHandle, storeHandle } from "../firebase/client";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import moment from "moment";
import LikeSaveShare from "./LikeSaveShare";

const AnswerCard = ({ ansid }) => {
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    (async () => {
      const docRef = doc(storeHandle, "answers", ansid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAnswer(docSnap.data());
      }
    })();
  }, []);

  if (!answer) {
    return null;
  }


  return (
    <Card
      sx={{
        backgroundColor: "background.default",
        boxShadow: "0",
        border: "2px solid #ff3d00",
        borderRadius: ".8rem",
        my: "0.5rem",
        width: "90vw",
        maxWidth: "700px",
      }}
    >
      <CardActionArea href={`/answers/${ansid}`}>
        <Box sx={{ pt: "1rem", px: "1rem", pb: "0.1rem" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: ".7rem" }}>
            {answer.title}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            <Box
              component="div"
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {answer.desc}
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", my:".3rem" }}>
              Tags: {" "}{answer.tags.filter(d => d != answer.title.split(" ").join("_").toLowerCase()).join(", ")}
          </Typography>
        </Box>
      </CardActionArea>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          m: "1rem",
          mt: "0rem",
        }}
      >
        {!answer.isPrivate || answer.creatorid == authHandle.currentUser.uid ? (<LikeSaveShare ansid={ansid} />) : null}
        
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          }}
        >
          <Button
            variant="text"
            sx={{ mx: ".2rem", fontWeight: "bold" }}
            href={`/profile/${answer.creatorid}`}
          >
            {answer.creatorName}
          </Button>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {moment.unix(answer.createdAt).format("lll")}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default AnswerCard;

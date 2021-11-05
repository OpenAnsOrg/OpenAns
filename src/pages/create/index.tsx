import Typography from "@mui/material/Typography"
import { authHandle } from "../../firebase/client"
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../../components/Loading";

const Create = () => {
  const [user, loading] = useAuthState(authHandle);
  if (loading) {
    return <Loading />
  }
  if(!user) {
    return <Typography variant="h4">You must be logged in to create answers</Typography>
  }
  return (
    <Typography variant="h4" sx={{ my: "2rem" }}>
      Create
    </Typography>
  )
}

export default Create

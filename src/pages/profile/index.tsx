import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { authHandle } from "../../firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../../components/Loading";

const Profile = () => {
  const [user, loading] = useAuthState(authHandle);
  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return (
      <Typography variant="h4" sx={{ my: "2rem" }}>
        You must be logged in to see profiles
      </Typography>
    );
  }
  return (
    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <Typography variant="h4" sx={{ my: "2rem" }}>
        Profile
      </Typography>
    </Box>
  );
};

export default Profile;

import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

const Comments = ({ansid}) => {
  return (
    <Box sx={{my:"1rem"}}>
      <Typography variant="h6" sx={{fontWeight: "bold"}}>Comments: </Typography>
    </Box>
  )
}

export default Comments

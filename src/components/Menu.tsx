import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Log from "./Log"

const Menu = () => {
  return (
    <Box sx={{display: "flex", justifyContent: "space-evenly", minWidth: "500px", }}>
      <Button variant="text" href="/answers" sx={{color: "white"}}>Answers</Button>
      <Button variant="text" href="/create" sx={{color: "white"}}>Create</Button>
      {/* <Button variant="text" href="/groups" sx={{color: "white"}}>Groups</Button> */}
      <Button variant="text" href="/profile" sx={{ color: "white" }}>Profile</Button>
      <Log />
    </Box>
  )
}

export default Menu

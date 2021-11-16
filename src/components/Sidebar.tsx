import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Log from "./Log";
import Link from "next/link";

function SideBar() {
	const [toggleState, setToggleState] = useState(false);

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setToggleState(open);
	};

	const list = () => (
		<Box
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
			sx={{
				width: 250,
				display: "flex",
				alignItems: "center",
			}}
		>
			<List
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<ListItem>
					<ListItemButton
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Link href="/answers">
							<a style={{ textDecoration: "none", color: "black" }}>Answers</a>
						</Link>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Link href="/create">
							<a style={{ textDecoration: "none", color: "black" }}>Create</a>
						</Link>
					</ListItemButton>
				</ListItem>
				{/* <ListItem>
					<ListItemButton
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Link href="/groups">
							<a style={{ textDecoration: "none", color: "black" }}>Groups</a>
						</Link>
					</ListItemButton>
				</ListItem> */}
				<Divider />
				<ListItem>
					<ListItemButton
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Link href="/profile">
							<a style={{ textDecoration: "none", color: "black" }}>Profile</a>
						</Link>
					</ListItemButton>
				</ListItem>
				<ListItem sx={{ display: "flex", justifyContent: "center" }}>
					<Log />
				</ListItem>
			</List>
		</Box>
	);

	return (
		<div>
			<IconButton onClick={toggleDrawer(true)}>
				<MenuIcon style={{ color: "#fff" }} />
			</IconButton>
			<div>
        <Drawer anchor="right" open={toggleState} onClose={toggleDrawer(false)}>
          {list()}
				</Drawer>
			</div>
		</div>
	);
}

export default SideBar;
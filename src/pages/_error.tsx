import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Lottie from "react-lottie";
import animationData from "../../public/lottie/errorLottie.json";

function Error() {
  const defaultOptions = {
		loop: false,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};
	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "auto",
			}}
		>
		<div>
			<Lottie options={defaultOptions} height={300} width={300} />
		</div>
			<Typography variant="h6" sx={{ width: "auto", display: "flex" }}>
				Oops! Something went wrong
			</Typography>
		</Container>
	);
}

export default Error;
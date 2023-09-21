import { ConfigProvider } from "antd";
import AuthRoutes from "./routes/auth-route";

const App = () => {
	return (
		<ConfigProvider theme={{ token: { colorPrimary: "#b191ff" } }}>
			<AuthRoutes />
		</ConfigProvider>
	);
};

export default App;

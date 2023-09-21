import { ProConfigProvider } from "@ant-design/pro-components";
import { Outlet } from "react-router-dom";

const Auth = () => {
	return (
		<div>
			<ProConfigProvider hashed={false}>
				<Outlet />
			</ProConfigProvider>
		</div>
	);
};

export default Auth;

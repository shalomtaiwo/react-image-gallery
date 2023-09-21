import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";

/* eslint-disable-next-line react/prop-types */
const SideDrawer = ({ showDrawer }) => {
	

	return (
		<div>
			<Button
				icon={<MenuOutlined />}
				onClick={showDrawer}
			/>
		</div>
	);
};

export default SideDrawer;

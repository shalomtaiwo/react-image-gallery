/* eslint-disable react/prop-types */
import { LogoutOutlined } from "@ant-design/icons";
import {
	Button,
	Divider,
	Drawer,
	Dropdown,
	FloatButton,
	Image,
	Layout,
	Menu,
	Space,
	message,
	theme,
} from "antd";
import { Outlet } from "react-router-dom";
import Folders from "./folders/folders";
import { auth } from "../config/firebase-config";
import { signOut } from "firebase/auth";
import { useMedia } from "react-use";
import SideDrawer from "./sideDrawer";
import { useState } from "react";

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = ({ user }) => {
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const logout = async () => {
		await signOut(auth).then(() => {
			message.success("User logged out!");
			localStorage.setItem("userState", "logged-out");
		});
	};

	const isWide = useMedia("(max-width: 690px)");

	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
	};

	return (
		<Layout>
			<Header
				style={{
					padding: `${!isWide ? "0 10px 0 85px" : "0 10px"}`,
					background: "transparent",
					top: 0,
					width: "100%",
					zIndex: 0,
					height: "initial",
					lineHeight: "5px",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						width: "100%",
						alignItems: "center",
						marginTop: 10,
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-start",
							fontSize: 20,
							fontWeight: 700,
						}}
					>
						{isWide && <SideDrawer showDrawer={showDrawer} />}
						<div style={{ marginLeft: isWide && 15 }}>
							<p>Image Gallery</p>
						</div>
					</div>
					<div>
						<Dropdown.Button
							style={{ zIndex: 0 }}
							menu={{}}
							dropdownRender={() => (
								<div>
									<Divider
										style={{
											margin: 0,
										}}
									/>
									<Space
										style={{
											padding: "10px 5px",
										}}
									>
										<Button
											danger
											icon={<LogoutOutlined />}
											onClick={logout}
										>
											Logout
										</Button>
									</Space>
								</div>
							)}
						>
							{user?.displayName || "Hi there"}
						</Dropdown.Button>
					</div>
				</div>
			</Header>
			<Layout hasSider>
				{!isWide && (
					<Sider
						collapsed={true}
						style={{
							height: "100vh",
							position: "fixed",
							left: 0,
							top: 0,
							bottom: 0,
							zIndex: 9999,
							background: "#170b01",
						}}
					>
						<Image
							src="https://res.cloudinary.com/dg8os5pul/image/upload/v1695121322/The%20Image/theImage_npdrvl.png"
							alt="the gallery"
							preview={false}
						/>
					</Sider>
				)}

				<Layout
					className="site-layout"
					style={{
						marginLeft: !isWide && 75,
						marginTop: 20,
					}}
					hasSider
				>
					{!isWide && (
						<Sider
							style={{
								overflow: "auto",
								height: "100vh",
								position: "sticky",
								left: 0,
								top: 0,
								bottom: 0,
								background: colorBgContainer,
							}}
						>
							<Menu
								theme="light"
								mode="inline"
								defaultSelectedKeys={["4"]}
							>
								<Folders />
							</Menu>
						</Sider>
					)}
					<Drawer
						title={
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<h3>Folders</h3>
								<Image
									src="https://res.cloudinary.com/dg8os5pul/image/upload/v1695286237/The%20Image/gallery_dmc9hq.png"
									alt="the gallery"
									preview={false}
									width={35}
								/>
							</div>
						}
						placement="right"
						onClose={onClose}
						open={open}
					>
						<Folders />
					</Drawer>
					<Content
						style={{
							margin: "0 16px 0",
						}}
					>
						<div
							style={{
								padding: 24,
								background: colorBgContainer,
								minHeight: "80vh",
							}}
						>
							<Outlet />
							<FloatButton.BackTop />
						</div>
						<Footer
							style={{
								textAlign: "center",
							}}
						>
							Image Gallery ©2023 Created by Shalom
						</Footer>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};
export default Dashboard;

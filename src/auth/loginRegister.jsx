/* eslint-disable react/prop-types */
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {
	LoginFormPage,
	ProFormCheckbox,
	ProFormText,
} from "@ant-design/pro-components";
import { message, Spin, Tabs } from "antd";
import { useState } from "react";
import { auth, db } from "../config/firebase-config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function Login_Register({ user, loading }) {
	const [loginType, setLoginType] = useState("login");
	const [userState, setUserState] = useState(
		localStorage.getItem("userState") || null
	);

	const waitTime = (time = 100) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, time);
		});
	};

	const handleSetDoc = async (username, user) => {
		await setDoc(doc(db, "users", user?.uid), {
			uid: user?.uid,
			username: username,
			email: user?.email,
			access: "user",
			join: serverTimestamp(),
		})
			.then(() => {
				message.success("Registration successful!");
				localStorage.setItem("userState", "logged-in");
				setUserState(localStorage.getItem("userState"));
			})
			.catch((err) => {
				message.error(err.message);
			});
	};

	const onFinish = async (values) => {
		await waitTime(2000);
		if (loginType === "login") {
			await signInWithEmailAndPassword(auth, values.email, values.password)
				.then(() => {
					message.success("Login successful!");
					localStorage.setItem("userState", "logged-in");
					setUserState(localStorage.getItem("userState"));
				})
				.catch((err) => {
					message.error(err.message);
				});
		} else if (loginType === "register") {
			try {
				const { user } = await createUserWithEmailAndPassword(
					auth,
					values.email,
					values.password
				);
				if (user) {
					updateProfile(user, {
						displayName: values.username,
					})
						.then(() => {
							handleSetDoc(values.username, user);
						})
						.catch(() => {
							message.error("Error adding username.");
							handleSetDoc(values.username, user);
						});
				}
			} catch (error) {
				message.error(error.message);
			}
		}
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	if (user && userState === "logged-in")
		return (
			<Navigate
				to={"/"}
				replace
			/>
		);

	if (loading)
		return (
			<Spin tip="Loading">
				<div className="content" />
			</Spin>
		);

	return (
		<div
			style={{
				backgroundColor: "white",
				height: "calc(100vh)",
				overflow: "hidden",
				margin: 0,
				padding: 0,
			}}
		>
			<LoginFormPage
				backgroundImageUrl="https://res.cloudinary.com/dg8os5pul/image/upload/v1695124224/The%20Image/li-zhang-pWGhklLD6VA-unsplash_stzuyv.jpg"
				logo="https://res.cloudinary.com/dg8os5pul/image/upload/v1695286237/The%20Image/gallery_dmc9hq.png"
				title="Image Gallery"
				subTitle="Your Favorite Image Manager"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				style={{
					margin: 0,
					padding: 0,
				}}
				submitter={{
					searchConfig: {
						resetText: "reset",
						submitText: "submit",
					},
					resetButtonProps: {
						style: {
							// Hide the reset button
							display: "none",
						},
					},
					submitButtonProps: {},
				}}
			>
				<Tabs
					centered
					activeKey={loginType}
					onChange={(activeKey) => setLoginType(activeKey)}
				>
					<Tabs.TabPane
						key={"login"}
						tab={"Login"}
					/>
					<Tabs.TabPane
						key={"register"}
						tab={"Register"}
					/>
				</Tabs>
				{loginType === "login" && (
					<>
						<ProFormText
							name="email"
							fieldProps={{
								size: "large",
								prefix: <MailOutlined className={"prefixIcon"} />,
							}}
							placeholder={"Email"}
							rules={[
								{
									required: true,
									message: "Email required!",
								},
							]}
						/>
						<ProFormText.Password
							name="password"
							fieldProps={{
								size: "large",
								prefix: <LockOutlined className={"prefixIcon"} />,
							}}
							placeholder={"Password"}
							rules={[
								{
									required: true,
									message: "Password required！",
								},
							]}
						/>
					</>
				)}
				{loginType === "register" && (
					<>
						<ProFormText
							fieldProps={{
								size: "large",
								prefix: <MailOutlined className={"prefixIcon"} />,
							}}
							name="email"
							placeholder={"Email"}
							rules={[
								{
									required: true,
									message: "Email required",
								},
								{
									pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
									message: "Not a valid email",
								},
							]}
						/>

						<ProFormText
							name="username"
							fieldProps={{
								size: "large",
								prefix: <UserOutlined className={"prefixIcon"} />,
							}}
							placeholder={"Username"}
							rules={[
								{
									required: true,
									message: "Username required!",
								},
								{
									min: 3,
									message: "Username must be a min of 5 letters",
								},
							]}
						/>
						<ProFormText.Password
							name="password"
							fieldProps={{
								size: "large",
								prefix: <LockOutlined className={"prefixIcon"} />,
							}}
							placeholder={"Password"}
							rules={[
								{
									required: true,
									message: "Password required！",
								},
								{
									pattern: /^().{5,}$/,
									message: "Password must have a minimum of 5",
								},
							]}
						/>
					</>
				)}
				<div
					style={{
						marginBlockEnd: 24,
					}}
				>
					<ProFormCheckbox
						noStyle
						name="remember_me"
					>
						Remember me
					</ProFormCheckbox>
				</div>
			</LoginFormPage>
		</div>
	);
}

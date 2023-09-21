/* eslint-disable react/prop-types */
import { Spin } from "antd";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
	isAllowed,
	redirectPath = "/auth",
	loading,
	children,
}) => {
	if (loading) {
		return (
			<Spin tip="Loading">
				<div className="content" />
			</Spin>
		);
	}
	if (!isAllowed) {
		return (
			<Navigate
				to={redirectPath}
				replace
			/>
		);
	}

	return children ? children : <Outlet />;
};

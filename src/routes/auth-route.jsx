import { Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { ProtectedRoute } from "./protectedRoutes";
import { auth } from "../config/firebase-config";
import Dashboard from "../dashboard/dashboard";
import Auth from "../auth/auth";
import Login_Register from "../auth/loginRegister";
import EmptyRoute from "./emptyRoute";
import Gallery from "../dashboard/gallery/gallery";
import Public from "../dashboard/public/public";

const AuthRoutes = () => {
	const [user, loading] = useAuthState(auth);
	return (
		<Routes>
			<Route
				element={
					<ProtectedRoute
						isAllowed={!!user}
						loading={loading}
					/>
				}
			>
				<Route
					path="/"
					element={<Dashboard user={user} />}
				>
					<Route
						path="/"
						element={<Public user={user} />}
					/>
					<Route
						path="/:id"
						element={<Gallery user={user} />}
					/>
					{/* Other routes */}
					<Route
						path="*"
						element={<EmptyRoute />}
					/>
				</Route>
			</Route>
			<Route
				path="auth"
				element={<Auth />}
			>
				<Route
					path="/auth"
					element={<Login_Register user={user} loading={loading} />}
				/>
			</Route>
			<Route
				path="*"
				element={<EmptyRoute />}
			/>
		</Routes>
	);
};

export default AuthRoutes;

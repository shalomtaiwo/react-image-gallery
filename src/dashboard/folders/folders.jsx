import { Button, Divider, Skeleton, Tree, Typography } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import AddFolder from "./addFolder";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

const { Paragraph } = Typography;
const { DirectoryTree } = Tree;

let activeStyle = {
	backgroundColor: "rgb(177,145,255, 0.2)",
	textDecoration: "none",
	paddingLeft: "5px",
	display: "inline-block",
	width: "100%",
};
let inActiveStyle = {
	color: "grey",
	textDecoration: "none",
	display: "inline-block",
	width: "100%",
	paddingLeft: "5px",
};

const Folders = () => {
	const [treeData, setTreeData] = useState([]);
	const [user] = useAuthState(auth);
	const [value, loading, error] = useCollection(
		collection(db, "users", user?.uid, "gallery"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);


	const createTreeNode = (key, to, fileName) => ({
		title: (
			<NavLink
				style={({ isActive }) => (isActive ? activeStyle : inActiveStyle)}
				to={`/${to}`}
			>
				<Paragraph
					style={{
						display: "inline",
						textAlign: "center",
					}}
				>
					{fileName}
				</Paragraph>
			</NavLink>
		),
		key,
	});

	useEffect(() => {
		if (!loading && !error && value) {
			const newData = [];
			value.forEach((doc) => {
				const data = doc.data();
				newData.push(createTreeNode(data.id, data.id, data.filename));
			});
			setTreeData(newData);
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [value, loading, error]);
	if (loading) return <Skeleton style={{ padding: 10 }} />;

	return (
		<div>
			<NavLink
				style={({ isActive }) => (isActive ? activeStyle : inActiveStyle)}
				to={"/"}
			>
				<Button
					icon={<UnorderedListOutlined />}
					style={{
						border: 0,
						width: "100%",
						margin: "10px 0 0 0",
						borderRadius: 0,
						background: "transparent",
					}}
				>
					Public Folder
				</Button>
			</NavLink>
			<Divider />
			<AddFolder />
			<Divider />
			<DirectoryTree
				showLine
				multiple
				treeData={!loading && treeData}
			/>
		</div>
	);
};
export default Folders;

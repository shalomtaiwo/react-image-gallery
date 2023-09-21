import { Button, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase-config";
import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const AddFolder = () => {
	const [user] = useAuthState(auth);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [fileName, setFileName] = useState("");

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setFileName("");
		setLoading(false);
		setIsModalOpen(false);
	};

	const addNewFolder = async () => {
		setLoading(true);
		if (fileName !== "") {
			let docRef = doc(
				db,
				"users",
				user?.uid,
				"gallery",
				fileName.toLowerCase()
			);
			const docSnapshot = await getDoc(docRef);

			try {
				if (docSnapshot.exists()) {
					setTimeout(() => {
						setLoading(false);
						handleCancel();
						message.error(
							`Folder with the name ${fileName.toLowerCase()} already exists!`
						);
					}, 2000);
				} else {
					await setDoc(docRef, {
						filename: fileName,
						slug: fileName.toLowerCase(),
						id: fileName.toLowerCase(),
						key: uuidv4(),
					})
						.then(() => {
							setTimeout(() => {
								setLoading(false);
								handleCancel();
								message.success("Folder created successfully!");
							}, 2000);
						})
						.catch((err) => {
							message.warning(err.message);
						});
				}
			} catch (error) {
				setTimeout(() => {
					setLoading(false);
					message.error("Error creating folder");
				}, 2000);
			}
		} else {
			setTimeout(() => {
				setLoading(false);
				handleCancel();
				message.error("Folder name cannot be empty");
			}, 2000);
		}
	};
	return (
		<div>
			<Button
				type="link"
				style={{
					border: 0,
					width: "100%",
					margin: "-14px 0 -14px 0",
					borderRadius: 0,
					color: "#6419e6",
				}}
				icon={<PlusOutlined />}
				onClick={showModal}
			>
				Add Folder
			</Button>

			<Modal
				title="Add Folder"
				open={isModalOpen}
				maskClosable={false}
				destroyOnClose={true}
				onCancel={handleCancel}
				footer={[
					<Button
						key="cancel"
						onClick={handleCancel}
					>
						Cancel
					</Button>,
					<Button
						key="submit"
						type="primary"
						loading={isLoading}
						onClick={addNewFolder}
						disabled={fileName.length < 4 ? true : false}
					>
						Submit
					</Button>,
				]}
			>
				<Input
					allowClear
					maxLength={10}
					showCount
					onChange={(value) => setFileName(value.target.value)}
					placeholder="Folder name"
				/>
			</Modal>
		</div>
	);
};

export default AddFolder;

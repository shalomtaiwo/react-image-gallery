import ImgCrop from "antd-img-crop";
import { Button, Divider, Modal, Upload, message } from "antd";
import { useState } from "react";
import axios from "axios";
import ImageTags from "./imageTags";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase-config";
import { addDoc, collection } from "firebase/firestore";

/* eslint-disable-next-line react/prop-types */
const UploadImages = ({ publicFolder, folderName, exist }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [fileList, setFileList] = useState([]);
	const [newFile, setNewFile] = useState("");
	const [tags, setTags] = useState([]);
	const [user] = useAuthState(auth);

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setTags([]);
		setFileList([]);
		setNewFile("");
		setLoading(false);
		setIsModalOpen(false);
	};

	const handleRemove = () => {
		setFileList([]);
		setNewFile("");
		setLoading(false);
	};

	const onChange = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};

	const customRequest = async ({ file, onSuccess }) => {
		setLoading(true);

		// Preview the image
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			reader.result;
			onSuccess("ok");
		};

		// Upload the image to Cloudinary
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
		formData.append("api_key", import.meta.env.VITE_IMAGE_API);

		try {
			const response = await axios.post(
				"https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
				formData,
				{
					headers: { "X-Requested-With": "XMLHttpRequest" },
				}
			);

			const data = response.data;
			const fileURL = data.secure_url;
			setNewFile(fileURL);

			setTimeout(() => {
				setLoading(false);
			}, 1000);
		} catch (error) {
			message.error("Error uploading, please retry");
		}
	};

	const handleOk = async () => {
		setLoading(true);
		if (publicFolder === true) {
			try {
				await addDoc(collection(db, "publicFolder"), {
					src: newFile,
					tags,
				});

				setTimeout(() => {
					setLoading(false);
					handleCancel();
				}, 2000);
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				if (exist === true) {
					const docRef = collection(
						db,
						"users",
						user?.uid,
						"gallery",
						folderName,
						"images"
					);

					await addDoc(docRef, {
						src: newFile,
						tags,
					}).then(() => {
						setTimeout(() => {
							setLoading(false);
							handleCancel();
						}, 2000);
					});
				} else {
					setTimeout(() => {
						setLoading(false);
						handleCancel();
						message.warning("Folder does not exist");
					}, 1000);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<>
			<Button
				type="primary"
				onClick={showModal}
			>
				Upload
			</Button>
			<Modal
				title="Upload"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				maskClosable={false}
				destroyOnClose={true}
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
						onClick={handleOk}
						disabled={tags.length < 1 || (newFile === "" && true)}
					>
						Submit
					</Button>,
				]}
			>
				<ImgCrop rotationSlider>
					<Upload
						listType="picture"
						fileList={fileList}
						onChange={onChange}
						onRemove={handleRemove}
						customRequest={customRequest}
					>
						{fileList.length < 1 && <Button>+ Upload Image</Button>}
					</Upload>
				</ImgCrop>
				<Divider />
				<ImageTags
					tags={tags}
					setTags={setTags}
				/>
			</Modal>
		</>
	);
};

export default UploadImages;

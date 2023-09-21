/* eslint-disable react/prop-types */
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Empty, Image, Skeleton } from "antd";
import { useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase-config";
import SearchFolder from "../folders/searchFolder";
import NewDndContext from "../public/newDndContext";
import SortableImage from "../public/sort";
import EmptyRoute from "../../routes/emptyRoute";

const Gallery = ({ user }) => {
	const { id } = useParams();

	const [dataSource, setDataSource] = useState([]);
	const [imageSearch, setImageSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [galleryExists, setGalleryExists] = useState(false); // New state to track gallery existence

	const onSearch = (value) => {
		setImageSearch(value || "");
	};

	const [value, loading] = useCollection(
		collection(db, "users", user?.uid, "gallery", id, "images"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	useEffect(() => {
		const checkGalleryExists = async () => {
			try {
				const docRef = doc(db, "users", user?.uid, "gallery", id);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setGalleryExists(true);
				} else {
					setGalleryExists(false);
				}
			} catch (error) {
				console.error("Error checking gallery existence:", error);
			}
		};

		checkGalleryExists();
	}, [id, user?.uid]);

	useEffect(() => {
		if (!loading && value) {
			const data = value.docs.map((doc) => ({
				key: doc.id,
				...doc.data(),
			}));
			setDataSource(data);
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	}, [loading, value, id]);

	const filteredDataSource = dataSource.filter((item) =>
		item.tags.some((tag) => tag.includes(imageSearch.toLowerCase()))
	);

	if (loading) return <Skeleton active />;

	return (
		<div>
			<SearchFolder
				current={id}
				publicFolder={false}
				folderName={id}
				onSearch={onSearch}
				exist={galleryExists}
			/>
			<NewDndContext setDataSource={setDataSource}>
				<SortableContext
					items={filteredDataSource.map((item) => item.key)}
					strategy={rectSortingStrategy}
				>
					<Image.PreviewGroup
						preview={{
							onChange: (current, prev) =>
								console.log(`current index: ${current}, prev index: ${prev}`),
						}}
					>
						{!loading && !galleryExists && <EmptyRoute />}
						{!loading && galleryExists && filteredDataSource.length < 1 && (
							<Empty description={'Folder is currently empty!'} />
						)}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
								gridGap: "5px",
							}}
						>
							{!loading &&
								galleryExists &&
								filteredDataSource.map((item, index) => (
									<Skeleton
										active
										key={item.key}
										loading={isLoading}
									>
										<SortableImage
											id={item.key}
											src={item.src}
											tags={item.tags}
											alt={item.alt}
											index={index}
										/>
									</Skeleton>
								))}
						</div>
					</Image.PreviewGroup>
				</SortableContext>
			</NewDndContext>
		</div>
	);
};

export default Gallery;

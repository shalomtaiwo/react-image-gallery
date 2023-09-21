import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Empty, Image, Skeleton } from "antd";
import { useState, useEffect } from "react";
import { db } from "../../config/firebase-config";
import { collection } from "firebase/firestore";
import SearchFolder from "../folders/searchFolder";
import SortableImage from "./sort";
import NewDndContext from "./newDndContext";
import { useCollection } from "react-firebase-hooks/firestore";

const Public = () => {
	const [dataSource, setDataSource] = useState([]);
	const [imageSearch, setImageSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const onSearch = (value) => {
		setImageSearch(value || "");
	};

	const [value, loading] = useCollection(collection(db, "publicFolder"), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

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
	}, [loading, value]);

	const filteredDataSource = dataSource.filter((item) =>
		item.tags.some((tag) => tag.includes(imageSearch.toLowerCase()))
	);

	if (loading) return <Skeleton active />;

	return (
		<div>
			<SearchFolder
				current={"Public Folder"}
				publicFolder={true}
				onSearch={onSearch}
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
						{imageSearch !== "" && filteredDataSource.length < 1 && (
							<Empty description="Search word not found!" />
						)}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
								gridGap: "5px",
							}}
						>
							{filteredDataSource.map((item, index) => (
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

export default Public;

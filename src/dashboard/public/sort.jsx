import { useSortable } from "@dnd-kit/sortable";
import { Button, Image, Tag } from "antd";
import { CSS } from "@dnd-kit/utilities";

/* eslint-disable-next-line react/prop-types */
const SortableImage = ({ src, alt, tags, id }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		...attributes.style,
		transform: CSS.Transform.toString(
			transform && {
				...transform,
				scaleY: 1,
			}
		),
		transition,
		cursor: "move",
		zIndex: isDragging ? 9999 : "auto",
	};

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			style={style}
		>
			<Button
				{...listeners}
				style={{
					width: "100%",
					borderRadius: '8px 8px 0 0',
					cursor: "move",
					display: "flex",
					justifyContent: "start",
					alignContent: "center",
				}}
			>
				{tags &&
					/* eslint-disable-next-line react/prop-types */
					tags?.map((tag, index) => {
						return (
							<div key={index}>
								<Tag color={tags[0] === tag ? "purple" : "cyan"}>{tag}</Tag>
							</div>
						);
					})}
			</Button>
			<Image
				width={"100%"}
				src={src}
				alt={alt}
			/>
		</div>
	);
};

export default SortableImage;

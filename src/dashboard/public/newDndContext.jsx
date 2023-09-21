/* eslint-disable react/prop-types */
import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	KeyboardSensor,
	TouchSensor,
	closestCenter,
} from "@dnd-kit/core";

const NewDndContext = ({ children, setDataSource }) => {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: (sortable) => {
				const rect = sortable.rect;
				return { x: rect.left, y: rect.top };
			},
		})
	);

	const onDragEnd = ({ active, over }) => {
		if (active.id !== over?.id) {
			setDataSource((prev) => {
				const activeIndex = prev.findIndex((i) => i.key === active.id);
				const overIndex = prev.findIndex((i) => i.key === over?.id);
				const updatedData = [...prev];
				updatedData.splice(overIndex, 0, updatedData.splice(activeIndex, 1)[0]);
				return updatedData;
			});
		}
	};

	return (
		<DndContext
			sensors={sensors}
			onDragEnd={onDragEnd}
			collisionDetection={closestCenter}
		>
			{children}
		</DndContext>
	);
};

export default NewDndContext;

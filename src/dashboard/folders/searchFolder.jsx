/* eslint-disable react/prop-types */
import { Breadcrumb, Input } from "antd";
import UploadImages from "./uploadImages";

const { Search } = Input;

const SearchFolder = ({
	current,
	publicFolder,
	folderName,
	onSearch,
	exist,
}) => {
	return (
		<div style={{ paddingBottom: 40 }}>
			<div>
				<Breadcrumb
					items={[
						{
							title: "Home",
						},
						{
							title: current,
						},
					]}
				/>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignContent: "center",
					marginTop: 15,
				}}
			>
				<div>
					<Search
						placeholder="search Image tags"
						onSearch={(e) => onSearch(e)}
						allowClear
					/>
				</div>

				<div style={{ marginLeft: 10 }}>
					<UploadImages
						publicFolder={publicFolder}
						folderName={folderName}
						exist={exist}
					/>
				</div>
			</div>
		</div>
	);
};

export default SearchFolder;

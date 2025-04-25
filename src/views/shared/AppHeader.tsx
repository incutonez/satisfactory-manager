import { useState } from "react";
import { version } from "@/../package.json";
import { getCurrentSearch, setSearch } from "@/api/activeItem.ts";
import { deleteFactoryThunk, getActiveFactory, getFactories, setActiveFactory } from "@/api/factories.ts";
import { clearInventoryThunk, downloadInventory } from "@/api/inventory.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDropdown } from "@/components/BaseDropdown.tsx";
import { BaseMenuItem } from "@/components/BaseMenuItem.tsx";
import { ComboBox } from "@/components/ComboBox.tsx";
import { FieldText } from "@/components/FieldText.tsx";
import { IconAdd, IconDelete, IconDownload, IconEdit, IconImport, IconRevert } from "@/components/Icons.tsx";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { ViewFactory } from "@/views/ViewFactory.tsx";
import { ViewImport } from "@/views/ViewImport.tsx";

export function AppHeader() {
	const dispatch = useAppDispatch();
	const factories = useAppSelector(getFactories);
	const activeFactory = useAppSelector(getActiveFactory);
	const search = useAppSelector(getCurrentSearch);
	const [factoryDialogName, setFactoryDialogName] = useState<string | undefined>("");
	const [showFactoryDialog, setShowFactoryDialog] = useState(false);
	const [showImportDialog, setShowImportDialog] = useState(false);
	const [isEditFactory, setIsEditFactory] = useState(false);

	function onClickClearData() {
		dispatch(clearInventoryThunk());
	}

	function onClickDownloadData() {
		dispatch(downloadInventory());
	}

	function onClickImportData() {
		setShowImportDialog(true);
	}

	function onSetFactory(factoryId?: string) {
		dispatch(setActiveFactory(factoryId));
	}

	function onClickEditFactory() {
		setFactoryDialogName(activeFactory?.name);
		setIsEditFactory(true);
		setShowFactoryDialog(true);
	}

	function onClickAddFactory() {
		setFactoryDialogName("");
		setIsEditFactory(false);
		setShowFactoryDialog(true);
	}

	function onClickDeleteFactory() {
		if (activeFactory) {
			dispatch(deleteFactoryThunk(activeFactory));
		}
	}

	function onSetSearch(value = "") {
		dispatch(setSearch(value));
	}

	return (
		<article className="flex flex-col">
			<h2 className="font-semibold text-xl mb-4">
				<a
					href="https://store.steampowered.com/app/526870/Satisfactory/"
					className="link"
					target="_blank"
				>
					Satisfactory
				</a>
				{" "}
				<span>
					Production Manager
					<a
						className="link ml-1"
						href="https://github.com/incutonez/satisfactory-manager/blob/main/CHANGELOG.md"
						target="_blank"
					>
						v
						{version}
					</a>
				</span>
			</h2>
			<section className="flex">
				<section className="flex space-x-2">
					<ComboBox
						label="Factory"
						value={activeFactory?.id ?? ""}
						options={factories}
						valueField="id"
						displayField="name"
						setValue={onSetFactory}
					/>
					<BaseDropdown>
						<BaseMenuItem
							icon={IconEdit}
							text="Edit"
							onAction={onClickEditFactory}
						/>
						<BaseMenuItem
							text="Delete"
							icon={IconDelete}
							onAction={onClickDeleteFactory}
							isDisabled={factories?.length <= 1}
						/>
						<BaseMenuItem
							text="Clear"
							icon={IconRevert}
							onAction={onClickClearData}
						/>
						<BaseMenuItem
							text="Download"
							icon={IconDownload}
							onAction={onClickDownloadData}
						/>
						<BaseMenuItem
							text="Import"
							icon={IconImport}
							onAction={onClickImportData}
						/>
					</BaseDropdown>
					<BaseButton
						text="Factory"
						title="Add New Factory"
						icon={IconAdd}
						onClick={onClickAddFactory}
					/>
				</section>
				<section className="ml-auto flex space-x-2">
					<FieldText
						value={search}
						onChange={onSetSearch}
						label="Search"
						placeholder="Search..."
					/>
				</section>
			</section>
			<ViewFactory
				isEdit={isEditFactory}
				factoryName={factoryDialogName}
				show={showFactoryDialog}
				setShow={setShowFactoryDialog}
			/>
			<ViewImport
				show={showImportDialog}
				setShow={setShowImportDialog}
			/>
		</article>
	);
}

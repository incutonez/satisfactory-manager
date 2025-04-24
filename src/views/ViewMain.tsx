import { useEffect, useState } from "react";
import { Key } from "react-aria-components";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { BaseTab } from "@/components/BaseTab.tsx";
import { BaseTabContents } from "@/components/BaseTabContents.tsx";
import { BaseTabs } from "@/components/BaseTabs.tsx";
import { RouteViewItems, RouteViewPower } from "@/routes.ts";
import { AppHeader } from "@/views/shared/AppHeader.tsx";

const rootItemsId = "root-items";
const rootPowerId = "root-power";

export function ViewMain() {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedTab, setSelectedTab] = useState<Key>(rootItemsId);
	const tabs = (
		<>
			<BaseTab
				text="Items"
				id={rootItemsId}
			/>
			<BaseTab
				text="Power"
				id={rootPowerId}
			/>
		</>
	);

	function onSelectTab(tabId: Key) {
		setSelectedTab(tabId);
		if (tabId === rootItemsId) {
			navigate({
				to: RouteViewItems,
			});
		}
		else if (tabId === rootPowerId) {
			navigate({
				to: RouteViewPower,
			});
		}
	}

	useEffect(() => {
		const { pathname } = location;
		if (pathname === RouteViewPower) {
			setSelectedTab(rootPowerId);
		}
		else if (pathname === RouteViewItems) {
			setSelectedTab(rootItemsId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<AppHeader />
			<BaseTabs
				className="flex flex-col overflow-hidden"
				tabs={tabs}
				selectedKey={selectedTab}
				onSelectionChange={onSelectTab}
			>
				<>
					<BaseTabContents
						id={rootItemsId}
						className="overflow-hidden flex-1"
					>
						<Outlet />
					</BaseTabContents>
					<BaseTabContents
						id={rootPowerId}
						className="overflow-hidden flex-1"
					>
						<Outlet />
					</BaseTabContents>
				</>
			</BaseTabs>
		</>
	);
}

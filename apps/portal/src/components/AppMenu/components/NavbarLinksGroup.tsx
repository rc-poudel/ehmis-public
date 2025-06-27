"use client";

import { useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import {
	Box,
	Collapse,
	Group,
	Text,
	ThemeIcon,
	Tooltip,
	useMantineTheme,
} from "@mantine/core";
import classes from "./NavbarLinksGroup.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import { getForeground } from "@packages/shared/utils";
import { useGetImageUrl } from "@/utils/client/images";

interface LinksGroupProps {
	icon?: string;
	label: string;
	path?: string;
	initiallyOpened?: boolean;
	collapsed?: boolean;
	subMenus?: LinksGroupProps[];
	onOpen?: () => void;
}

export function LinksGroup({
	icon,
	label,
	initiallyOpened,
	path,
	collapsed,
	onOpen,
	subMenus,
}: LinksGroupProps) {
	const pathname = usePathname();
	const hasLinks = Array.isArray(subMenus) && subMenus.length > 0;
	const [opened, setOpened] = useState(initiallyOpened || false);
	const getImageUrl = useGetImageUrl();
	const imageURL = icon ? getImageUrl(icon) : undefined;
	const pathAfterModules = pathname.replace(/^\/modules\//, "");
	const isActive = path && pathAfterModules === path;
	const theme = useMantineTheme();
	const color = theme.primaryColor;

	const items = hasLinks
		? subMenus.map((subMenu) => {
				const isActiveSubMenu =
					subMenu.path && pathAfterModules === subMenu.path;
				return (
					<Link
						key={subMenu.label}
						href={`/modules/${subMenu.path}`}
						prefetch
					>
						<Text
							className={classes.link}
							data-active={isActiveSubMenu ? true : undefined}
							c={
								isActiveSubMenu
									? getForeground(color)
									: undefined
							}
							bg={isActiveSubMenu ? color : undefined}
						>
							{subMenu.label}
						</Text>
					</Link>
				);
			})
		: null;

	const hasActiveSubmenu = subMenus?.some(
		(subMenu) => subMenu.path && pathAfterModules === subMenu.path,
	);

	const mainContent = (
		<Box
			onClick={() => {
				if (onOpen) {
					onOpen();
				}
				setOpened((o) => (collapsed ? true : !o));
			}}
			style={{ cursor: "pointer" }}
			bg={
				(isActive && !hasLinks) || hasActiveSubmenu
					? color + ".1"
					: undefined
			}
			className={classes.control}
			data-active={
				(isActive && !hasLinks) || hasActiveSubmenu ? true : undefined
			}
		>
			<Group justify={"space-between"} gap={0} wrap="nowrap">
				<Box style={{ display: "flex", alignItems: "center" }}>
					<Tooltip
						label={label}
						disabled={!collapsed}
						position="right"
					>
						<ThemeIcon
							variant="light"
							size="lg"
							radius="sm"
							autoContrast
							c={isActive || hasActiveSubmenu ? color : "gray"}
							style={{
								marginLeft: collapsed ? 8 : 0,
								transition:
									"margin 300ms cubic-bezier(0.4, 0, 0.2, 1)",
							}}
						>
							{icon && (
								<ReactSVG
									width={collapsed ? 20 : 18}
									height={collapsed ? 20 : 18}
									src={imageURL!}
								/>
							)}
						</ThemeIcon>
					</Tooltip>
					<Box
						ml="md"
						style={{
							transition:
								"opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
							opacity: collapsed ? 0 : 1,
							overflow: "hidden",
						}}
						c={
							(isActive && !hasLinks) || hasActiveSubmenu
								? color
								: undefined
						}
					>
						{label}
					</Box>
				</Box>
				{hasLinks && !collapsed && (
					<IconChevronRight
						className={classes.chevron}
						stroke={1.5}
						size={16}
						style={{
							transform: opened ? "rotate(-90deg)" : "none",
						}}
					/>
				)}
			</Group>
		</Box>
	);

	return (
		<>
			{hasLinks ? (
				mainContent
			) : (
				<Link href={`/modules/${path}`} prefetch>
					{mainContent}
				</Link>
			)}
			{hasLinks && <Collapse in={opened && !collapsed}>{items}</Collapse>}
		</>
	);
}

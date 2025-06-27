"use client";
import { AppAppearanceConfig } from "@packages/shared/schemas";
import { getAppTheme } from "@/utils/theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import React from "react";
import { ModalsProvider } from "@mantine/modals";

export function Providers({
	config,
	children,
}: {
	config?: AppAppearanceConfig;
	children: React.ReactNode;
}) {
	const theme = config ? getAppTheme(config) : undefined;

	return (
		<MantineProvider theme={theme}>
			<Notifications />
			<ModalsProvider>{children}</ModalsProvider>
		</MantineProvider>
	);
}

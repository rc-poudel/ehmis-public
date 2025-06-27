"use client";
import "./globals.css";
import "@mantine/core/styles.css";

import {
	Box,
	Button,
	ColorSchemeScript,
	Container,
	Group,
	mantineHtmlProps,
	MantineProvider,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, []);

	return (
		<html {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider>
					<Notifications />
					<Container
						fluid
						className="h-screen flex flex-col justify-center items-center"
					>
						<Box>
							<Text
								fw={700}
								style={{
									fontSize: "16rem",
									margin: 0,
								}}
								className="opacity-40"
							>
								500
							</Text>
						</Box>
						<Box className="w-[40%] z-10">
							<Stack align="center">
								<Title>Unexpected Application Error</Title>
								<Text c="dimmed" size="lg" ta="center">
									We apologize, but something went wrong with
									the application. Please try again later. If
									the problem persists, contact your system
									administrator.
								</Text>
								<Group justify="center">
									<Button
										component={Link}
										href={"/"}
										size="md"
									>
										Refresh
									</Button>
								</Group>
							</Stack>
						</Box>
					</Container>
				</MantineProvider>
			</body>
		</html>
	);
}

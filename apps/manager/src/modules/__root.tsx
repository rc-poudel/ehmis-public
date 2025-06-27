import * as React from "react";
import { Suspense } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SideMenu } from "../shared/components/SideMenu/SideMenu";
import { CircularLoader } from "@dhis2/ui";
import { useCheckConfig } from "../shared/hooks/config";
import { InitialConfigurationSetup } from "../shared/components/InitialConfigurationSetup";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../shared/components/ErrorPage/ErrorPage";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const { metadataExists, loading } = useCheckConfig();

	if (loading)
		return (
			<div className="h-full w-full flex justify-center items-center">
				<CircularLoader />
			</div>
		);

	if (!metadataExists) return <InitialConfigurationSetup />;

	return (
		<React.Fragment>
			<div className="h-full w-full flex">
				<SideMenu />
				<main className="flex-1 h-full p-[16px] overflow-y-auto">
					<Suspense
						fallback={
							<div className="h-full w-full flex justify-center items-center">
								<CircularLoader />
							</div>
						}
					>
						<ErrorBoundary FallbackComponent={ErrorPage}>
							<Outlet />
						</ErrorBoundary>
					</Suspense>
				</main>
			</div>
		</React.Fragment>
	);
}

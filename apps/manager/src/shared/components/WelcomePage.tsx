import i18n from "@dhis2/d2-i18n";
import React from "react";
import { appMenus } from "../constants/menu";
import { Card, colors, Divider, IconLaunch16 } from "@dhis2/ui";
import { Link } from "@tanstack/react-router";
import { Links } from "../constants/links";

export function WelcomePage() {
	return (
		<div className="w-full h-full flex flex-col">
			<h1 className="font-bold">
				{i18n.t("Welcome to the public portal manager!")}
			</h1>
			<p className="text-gray-500">
				{i18n.t(
					"You can use this application to configure your public portal web application",
				)}
			</p>
			<div className=" grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4 align-top py-8 justify-items-start">
				{appMenus.map((menu) => (
					<Card dataTest={`${menu.label}-nav-card`} key={menu.href}>
						<div className="p-4 flex flex-col gap-2 h-full w-full">
							<h3 data-test="nav-card-header" className="text-lg">
								{menu.label}
							</h3>
							<p
								data-test="nav-card-description"
								className="text-gray-400 text-sm flex-1"
							>
								{menu.description}
							</p>
							<Divider />
							<Link
								data-test="nav-card-link"
								className="text-blue-900 text-sm text-center flex items-center justify-center gap-2"
								to={menu.href}
							>
								{menu.action}
								<IconLaunch16 color={colors.blue900} />
							</Link>
						</div>
					</Card>
				))}
			</div>
			<div className="w-full text-right mt-auto text-sm text-gray-400">
				<a href={Links.DOCUMENTATION}>
					{i18n.t("Read the")}{" "}
					<strong className="text-gray-500">
						{i18n.t("Documentation")}
					</strong>{" "}
					{i18n.t("to get started")}
				</a>
			</div>
		</div>
	);
}

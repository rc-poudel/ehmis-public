import {
	AppIconFile,
	MenuItem,
	menuItemSchema,
	MenuItemType,
} from "@packages/shared/schemas";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	ButtonStrip,
	CircularLoader,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import { useDialog } from "@hisptz/dhis2-ui";
import { MenuTypeSelector } from "./MenuTypeSelector";
import { MenuTypeInput } from "./MenuTypeInput";
import { z } from "zod";
import { useDataEngine } from "@dhis2/app-runtime";
import { RHFIconInput } from "../../../Fields/RHFIconInput";
import { useManageDocument } from "../../../../hooks/document";
import { set } from "lodash";

export interface MenuItemFormProps {
	onClose(): void;

	onSubmit(data: MenuItem): void;

	config?: MenuItem;
	sortOrder?: number;
	hide: boolean;
}

const fileQuery = {
	icon: {
		resource: `documents`,
		id: ({ icon }) => icon,
	},
};

export const menuItemFormSchema = menuItemSchema.and(
	z.object({
		iconFile: z.instanceof(AppIconFile).optional(),
	}),
);
export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export function MenuItemForm({
	config,
	sortOrder,
	onClose,
	onSubmit,
	hide,
}: MenuItemFormProps) {
	const engine = useDataEngine();
	const { confirm } = useDialog();
	const { create: createIcon } = useManageDocument();

	const form = useForm<MenuItemFormValues>({
		resolver: zodResolver(menuItemFormSchema),
		defaultValues: async () => {
			if (!config) {
				return {
					sortOrder,
					type: MenuItemType.MODULE,
				} as MenuItemFormValues;
			}

			const file = config.icon
				? ((await engine.query(fileQuery, {
						variables: {
							icon: config.icon,
						},
					})) as { icon: { displayName: string; id: string } })
				: undefined;

			return {
				...config,
				iconFile: file
					? new AppIconFile(
							[],
							`${file?.icon?.displayName.replace(`[public-portal] `, ``)}`,
							{
								type: "image/png",
							},
						).setId(file.icon.id)
					: undefined,
			} as MenuItemFormValues;
		},
		shouldFocusError: false,
	});

	const action = config ? i18n.t("Update") : i18n.t("Create");

	const onSave = async (data: MenuItemFormValues) => {
		const updatedData = {
			...data,
			icon: config?.icon,
		};

		if ((data.iconFile?.size ?? 0) > 0) {
			const iconId = await createIcon(data.iconFile!);
			set(updatedData, "icon", iconId);
		}

		onSubmit(menuItemSchema.parse(updatedData));
		form.reset();
		onClose();
	};

	const onCloseClick = () => {
		if (form.formState.isDirty) {
			confirm({
				title: i18n.t("Confirm exit"),
				message: i18n.t(
					"Are you sure you want to close this form?. All changes will be lost",
				),
				onConfirm() {
					onClose();
				},
			});
		} else {
			onClose();
		}
	};

	return (
		<FormProvider {...form}>
			<Modal position="middle" hide={hide} onClose={onCloseClick}>
				<ModalTitle>
					{action}
					{i18n.t(" menu item", {
						context: "Follows either create or update",
					})}
				</ModalTitle>
				<ModalContent>
					{form.formState.isLoading ? (
						<div className="w-full h-[400px] flex items-center justify-center">
							<CircularLoader small />
						</div>
					) : (
						<form className="flex flex-col gap-2">
							<MenuTypeInput />
							<RHFIconInput
								accept="svg"
								helpText={i18n.t(
									"Only SVG icons are supported",
								)}
								label={i18n.t("Icon")}
								name={"iconFile"}
							/>
							<MenuTypeSelector />
						</form>
					)}
				</ModalContent>
				<ModalActions>
					<ButtonStrip>
						<Button onClick={onCloseClick}>
							{i18n.t("Cancel")}
						</Button>
						<Button
							loading={form.formState.isSubmitting}
							onClick={() => form.handleSubmit(onSave)()}
							primary
						>
							{form.formState.isSubmitting
								? i18n.t("Uploading icon...")
								: action}
						</Button>
					</ButtonStrip>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}

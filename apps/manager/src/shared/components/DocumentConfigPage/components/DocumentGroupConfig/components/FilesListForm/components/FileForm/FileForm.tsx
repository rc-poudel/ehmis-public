import {
	Button,
	ButtonStrip,
	CircularLoader,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import React from "react";
import i18n from "@dhis2/d2-i18n";
import { FormProvider, useForm } from "react-hook-form";
import { DocumentItem, documentItemSchema } from "@packages/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFSingleSelectField, RHFTextInputField } from "@hisptz/dhis2-ui";
import { z } from "zod";
import { CustomFile, useGetFile, useUploadFile } from "./hooks/file";
import { RHFFileInputField } from "../../../../../../../Fields/RHFFileInputField";

const libraryFileFormSchema = documentItemSchema.extend({
	file: z.instanceof(File),
});

type LibraryFileFormData = z.infer<typeof libraryFileFormSchema>;

export function FileForm({
	onSave,
	onClose,
	file,
	hide,
	nested,
}: {
	onSave: (file: DocumentItem) => void;
	onClose: () => void;
	hide: boolean;
	file?: DocumentItem;
	nested?: boolean;
}) {
	const { getFile } = useGetFile();
	const form = useForm<LibraryFileFormData>({
		resolver: zodResolver(libraryFileFormSchema),
		defaultValues: file
			? async () => {
					const fileObject = await getFile(file.id);
					return {
						...file,
						file: fileObject,
					};
				}
			: {
					id: "",
				},
	});
	const { uploadFile } = useUploadFile();

	const onSaveClick = async (data: LibraryFileFormData) => {
		if (data.file instanceof CustomFile) {
			//Means we don't have to re-upload the file
			onSave({
				id: data.id ?? data.file.id!,
				type: data.type,
				label: data.label,
			});
		} else {
			const id = await uploadFile({ file: data.file, label: data.label });
			if (id) {
				onSave({
					id,
					type: data.type,
					label: data.label,
				});
			} else {
				// An error will already be shown by the upload util
			}
		}
	};
	return (
		<FormProvider {...form}>
			<Modal
				small={nested}
				position="middle"
				onClose={onClose}
				hide={hide}
			>
				<ModalTitle>{i18n.t("Add file")}</ModalTitle>
				<ModalContent>
					{form.formState.isLoading ? (
						<div className="flex flex-col justify-center items-center min-h-[240px] w-full">
							<CircularLoader small />
						</div>
					) : (
						<form className="flex flex-col gap-4">
							<RHFTextInputField
								required
								dataTest={"document-group-label-input"}
								name="label"
								label={i18n.t("Label")}
							/>
							<RHFSingleSelectField
								required
								dataTest={"document-type-select"}
								options={[
									{
										label: i18n.t("PDF"),
										value: "PDF",
									},
								]}
								name={"type"}
								label={i18n.t("File type")}
							/>
							<RHFFileInputField
								required
								dataTest={"file-input"}
								name={"file"}
								accept="application/pdf"
								label={i18n.t("File")}
							/>
						</form>
					)}
				</ModalContent>
				<ModalActions>
					<ButtonStrip>
						<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
						<Button
							dataTest={"save-file-button"}
							primary
							loading={form.formState.isSubmitting}
							onClick={(_, e) =>
								form.handleSubmit(onSaveClick)(e)
							}
						>
							{form.formState.isSubmitting
								? i18n.t("Uploading...")
								: i18n.t("Save")}
						</Button>
					</ButtonStrip>
				</ModalActions>
			</Modal>
		</FormProvider>
	);
}

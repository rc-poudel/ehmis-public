import { GridLayoutSectionConfig } from "@packages/shared/schemas";
import { SimpleGrid } from "@mantine/core";
import { DisplayItemContainer } from "@/components/displayItems/DisplayItemContainer";
import { DisplayItemSelector } from "@/components/displayItems/DisplayItemSelector";

export function GridSection({ config }: { config: GridLayoutSectionConfig }) {
	return (
		<SimpleGrid
			cols={{
				base: 4,
			}}
			spacing="sm"
		>
			{config.items.map((item) => (
				<DisplayItemContainer
					key={`${item.item.id}-container`}
					item={item}
				>
					<DisplayItemSelector item={item} />
				</DisplayItemContainer>
			))}
		</SimpleGrid>
	);
}

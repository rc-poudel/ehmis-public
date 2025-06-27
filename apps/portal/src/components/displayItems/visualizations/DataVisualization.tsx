import { ReadonlyURLSearchParams } from "next/navigation";
import { dhis2HttpClient } from "@/utils/api/dhis2";
import {
	ChartVisualizationItem,
	VisualizationChartType,
	VisualizationConfig,
} from "@packages/shared/schemas";
import { getAppearanceConfig } from "@/utils/config/appConfig";
import { YearOverYearDataVisComponent } from "@/components/displayItems/visualizations/YearOverYearDataVisComponent";
import { DataVisComponent } from "@/components/displayItems/visualizations/DataVisComponent";

export interface MainVisualizationProps {
	searchParams?: ReadonlyURLSearchParams;
	config: ChartVisualizationItem;
	showFilter?: boolean;
	disableActions?: boolean;
}

export async function getDataVisualization(config: ChartVisualizationItem) {
	const { id } = config;
	const visualizationConfig = await dhis2HttpClient.get<VisualizationConfig>(
		`visualizations/${id}`,
		{
			params: {
				fields: "*,organisationUnits[id,path],rows[id,dimension,items],columns[id,dimension,items],filters[id,dimension,items]",
			},
		},
	);
	return {
		visualizationConfig,
	};
}

export async function DataVisualization({
	config,
	disableActions,
	showFilter,
}: MainVisualizationProps) {
	const { visualizationConfig } = await getDataVisualization(config);
	const { appearanceConfig } = (await getAppearanceConfig())!;
	const colors = appearanceConfig.colors.chartColors;

	if (!visualizationConfig) {
		console.error(
			`Could not get visualization details for visualization ${config.id}`,
		);
		throw Error("Could not get visualization details");
	}

	if (
		[
			VisualizationChartType.YEAR_OVER_YEAR_COLUMN,
			VisualizationChartType.YEAR_OVER_YEAR_LINE,
		].includes(visualizationConfig.type)
	) {
		return (
			<YearOverYearDataVisComponent
				colors={colors}
				disableActions={disableActions}
				config={config}
				showFilter={showFilter}
				visualizationConfig={visualizationConfig}
			/>
		);
	}

	return (
		<DataVisComponent
			showFilter={showFilter}
			colors={colors}
			disableActions={disableActions}
			config={config}
			visualizationConfig={visualizationConfig}
		/>
	);
}

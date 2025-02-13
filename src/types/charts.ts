export interface ChartOfAccount {
  type: string;
  chartCode: string;
  chartName: string;
}

export interface Chartsponse {
  code: number;
  data: ChartOfAccount[]
}
  
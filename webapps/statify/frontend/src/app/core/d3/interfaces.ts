import { HierarchyLink } from "d3";

export interface ForceNodeDatum {
    name: string;
    children?: ForceNodeDatum[];
    value?: number;
}


export interface ForceGraphData {
    nodes: ForceNodeDatum[];
    links: HierarchyLink<ForceNodeDatum>[];
}
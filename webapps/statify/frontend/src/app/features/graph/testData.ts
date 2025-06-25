import * as d3 from 'd3';

// The interface for your raw JSON data
export interface TestData {
    name: string;
    children?: TestData[];
    value?: number;
}


// export type D3Node = d3.HierarchyNode<TestData>;
// export type ForceNode = D3Node & d3.SimulationNodeDatum;
// export type SvgSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;
// export type GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;
// export type SvgZoom = d3.ZoomBehavior<SVGSVGElement, unknown>;
// export type DragBehavior = d3.DragBehavior<SVGCircleElement, ForceNode, unknown>
// export type ForceSimulation = d3.Simulation<ForceNode, undefined>
// export type HierarchyLink<T> = d3.HierarchyLink<T>
// export type ZoomEvent = d3.D3ZoomEvent<SVGSVGElement, unknown>
// export type DragEvent = d3.D3DragEvent<SVGCircleElement, ForceNode, unknown>;
import * as d3 from 'd3';

export type D3Node<T> = d3.HierarchyNode<T>;
export type SvgSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;
export type GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

export type ForceNode<T> = D3Node<T> & d3.SimulationNodeDatum;
export type ForceSimulation<T> = d3.Simulation<ForceNode<T>, undefined>
export type HierarchyLink<T> = d3.HierarchyLink<T>

export type ZoomEvent = d3.D3ZoomEvent<SVGSVGElement, unknown>
export type SvgZoom = d3.ZoomBehavior<SVGSVGElement, unknown>;

export type DragEvent<T> = d3.D3DragEvent<SVGCircleElement, ForceNode<T>, unknown>;
export type DragBehavior<T> = d3.DragBehavior<SVGCircleElement, ForceNode<T>, unknown>
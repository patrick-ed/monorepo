import * as d3 from 'd3';
import { ForceNodeDatum } from './interfaces';

export type D3Node<T> = d3.HierarchyNode<T>;
export type SvgSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;
export type GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

export type ForceNode = D3Node<ForceNodeDatum> & d3.SimulationNodeDatum;
export type ForceSimulation = d3.Simulation<ForceNode, undefined>

export type ZoomEvent = d3.D3ZoomEvent<SVGSVGElement, unknown>
export type SvgZoom = d3.ZoomBehavior<SVGSVGElement, unknown>;

export type DragEvent = d3.D3DragEvent<SVGCircleElement, ForceNode, unknown>;
export type DragBehavior = d3.DragBehavior<SVGCircleElement, ForceNode, unknown>
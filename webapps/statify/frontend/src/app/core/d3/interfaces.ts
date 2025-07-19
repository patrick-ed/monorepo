import { HierarchyLink } from "d3";
import { ForceNode } from "./types";

export interface ForceNodeDatum {
    name: string;
    children?: ForceNodeDatum[];
    value?: number;
}

export interface GenreLink {
    source: string;
    target: string;
    lineWeight: number;
}

export interface GenreNode {
    id: string;
}

export interface GenreGraphData {
    nodes: GenreNode[];
    links: GenreLink[];
}

export interface ForceGraphData {
    nodes: ForceNodeDatum[];
    links: HierarchyLink<ForceNodeDatum>[];
}
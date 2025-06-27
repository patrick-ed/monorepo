import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as testData from './testData.json';
import { ForceNodeDatum } from '../../core/d3/interfaces';
import * as d3 from 'd3';
import { ForceNode, ForceSimulation, GSelection, SvgZoom, ZoomEvent, DragBehavior, HierarchyLink } from '../../core/d3/types';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit {


  @ViewChild('svg') private svgElement!: ElementRef<SVGSVGElement>;
  private testData = testData as ForceNodeDatum;

  ngAfterViewInit(): void {
    const data = this.testData;
    if (data && this.svgElement.nativeElement) {
      this.createChart(data);
    }
  }

  private createChart(chartData: ForceNodeDatum): void {
    const width = this.svgElement.nativeElement.clientWidth;
    const height = this.svgElement.nativeElement.clientHeight;

    const root = d3.hierarchy(chartData);
    const links = root.links();
    const nodes = root.descendants() as ForceNode[];

    const drag = (simulation: ForceSimulation): DragBehavior => {
      function dragstarted(event: any, d: ForceNode) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event: DragEvent, d: ForceNode) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event: any, d: ForceNode) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag<SVGCircleElement, ForceNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<ForceNode, HierarchyLink<ForceNodeDatum>>(links)
        .id(d => d.id!)
        .distance(50)
        .strength(1))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(this.svgElement.nativeElement)
      .attr("viewBox", [0, 0, width, height]);

    const container = svg.append("g");

    const link = container.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = container.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, ForceNode>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => d.children ? "#999" : "#333")
      .call(drag(simulation));

    node.append("title")
      .text(d => d.data.name);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as ForceNode).x!)
        .attr("y1", d => (d.source as ForceNode).y!)
        .attr("x2", d => (d.target as ForceNode).x!)
        .attr("y2", d => (d.target as ForceNode).y!);
      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
    });

    svg.call(this.applyZoomBehavior(container));
  }

  private applyZoomBehavior(container: GSelection): SvgZoom {
    const zoomHandler = (event: ZoomEvent) => {
      container.attr("transform", event.transform.toString());
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", zoomHandler);

    return zoom;
  }
}
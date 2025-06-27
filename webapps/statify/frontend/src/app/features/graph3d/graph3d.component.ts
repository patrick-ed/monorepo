import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-graph3d',
  imports: [],
  templateUrl: './graph3d.component.html',
  styleUrl: './graph3d.component.scss'
})
export class Graph3dComponent implements AfterViewInit {


  ngAfterViewInit(): void {

    const elem = document.getElementById("3d-graph");
    if (elem) {
      const Graph = new ForceGraph3D(elem)
        .enableNodeDrag(false)
        .onNodeClick((node) => this.removeNode(Graph, node))
        .graphData(this.initData);
      this.createChart(Graph);
    } else {
      console.error("Element with id '3d-graph' not found.");
    }
  }

  private initData = {
    nodes: [{ id: 0 }],
    links: []
  };


  private removeNode(Graph: ForceGraph3DInstance<any, any>, node: any) {
    let { nodes, links } = Graph.graphData();
    links = links.filter(l => l.source !== node && l.target !== node);
    nodes.splice(node.id, 1); // Remove node
    nodes.forEach((n, idx) => { n.id = idx; }); // Reset node ids to array index
    Graph.graphData({ nodes, links });
  }

  private createChart(Graph: any): void {

    setInterval(() => {
      const { nodes, links } = Graph.graphData();
      const id = nodes.length;
      Graph.graphData({
        nodes: [...nodes, { id }],
        links: [...links, { source: id, target: Math.round(Math.random() * (id - 1)) }]
      });
    }, 1000);
  }
}

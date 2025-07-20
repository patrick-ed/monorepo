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
      console.log(this.gData)
      const Graph = new ForceGraph3D(elem)
        .graphData(this.gData);
    } else {
      console.error("Element with id '3d-graph' not found.");
    }
  }

  private nodes = [
    { "id": "hello" },
    { "id": "world" },
  ]

  private links = [{
    "source": "hello",
    "target": "world"
  }]

  private N = 300;
  private gData = {
    nodes: [...Array(this.N).keys()].map(i => ({ id: i })),
    links: [...Array(this.N).keys()]
      .filter(id => id)
      .map(id => ({
        source: id,
        target: Math.round(Math.random() * (id - 1))
      }))
  };

  // private gData = {
  //   nodes: this.nodes,
  //   links: this.links
  // };
}

import ForceGraph3D from '3d-force-graph';
import { Component, inject, OnInit } from '@angular/core';
import type { NodeObject } from 'three-forcegraph';
import SpriteText from 'three-spritetext';
import { GenreGraphData, GenreNode } from '../../core/d3/interfaces';
import { GeneralUtilsService } from '../../core/services/utils/general-utils.service';

@Component({
  selector: 'app-genre-graph',
  imports: [],
  templateUrl: './genre-graph.component.html',
  styleUrl: './genre-graph.component.scss'
})
export class GenreGraphComponent implements OnInit {

  private generalUtils = inject(GeneralUtilsService)
  private genreGraphData = this.generalUtils.loadItemsFromLocalStorage('genreGraphData') || null

  ngOnInit(): void {
    const elem = document.getElementById("genre-graph");

    if (this.genreGraphData != null && elem != null) {
      const gData = this.genreGraphData[0] as GenreGraphData
      this.generateGraph(elem, gData)
    }
  }

  private generateGraph(elem: HTMLElement, gData: GenreGraphData) {
    console.log(gData)

    const Graph = new ForceGraph3D(elem)
      // .nodeAutoColorBy('group')
      .graphData(gData)
      .onNodeClick(node => {this.nodeClick(node)})
      .nodeThreeObject((node: GenreNode) => {
        const sprite = new SpriteText(node.id);
        sprite.textHeight = 8;
        sprite.offsetY = -14;
        return sprite;
      })
      .nodeThreeObjectExtend(true)
  }

  private nodeClick(node: NodeObject){
    console.log(node) 
  }
}

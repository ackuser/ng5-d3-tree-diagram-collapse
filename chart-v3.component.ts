import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as D3 from 'd3/index';

@Component({
  selector: 'app-chart-v3',
  templateUrl: './chart-v3.component.html',
  styleUrls: ['./chart-v3.component.scss']
})
export class ChartV3Component implements OnInit {
  dataList: any;
  margin: any;
  width: number;
  height: number;
  svg: any;
  duration: number;
  root: any;
  tree: any;
  treeData: any;
  nodes: any;
  links: any;

  @Input() set data(value) {
    this.setData(value);
  }

  constructor() { }

  ngOnInit() {
  }

  setData(value) {
    this.margin = { top: 20, right: 90, bottom: 30, left: 90 };
    this.width = 660 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.svg = D3.select('.container').append('svg')
    .attr('width', this.width + this.margin.right + this.margin.left)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.duration = 750;

    // declares a tree layout and assigns the size
    this.tree = D3.tree()
    .size([this.height, this.width]);

    // Assigns parent, children, height, depth
    this.root = D3.hierarchy(
    // this.dataList
    value
    , (d) => { return d.children; });
    this.root.x0 = this.height / 2;
    this.root.y0 = 10;
    debugger
    // Collapse after the second level
    // this.root.children.forEach(collapse);

    this.updateChart(this.root);

    // function collapse(d) {
    //   if (d.children) {
    //       d._children = d.children;
    //       d._children.forEach(collapse);
    //       d.children = null;
    //   }
    // }
  }

  // click(d) {
  //   console.log('click');
  //   if (d.children) {
  //     d._children = d.children;
  //     d.children = null;
  //   } else {
  //     d.children = d._children;
  //     d._children = null;
  //   }
  //   this.updateChart(d);
  // }

  updateChart(source) {
    let i = 0;
    console.log(source);
    this.treeData = this.tree(this.root);
    this.nodes = this.treeData.descendants();
    this.links = this.treeData.descendants().slice(1);
    this.nodes.forEach((d) => { d.y = d.depth * 180 });

    let node = this.svg.selectAll('g.node')
    .data(this.nodes, (d) => { return d.id || (d.id = ++i); });

    let nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', (d) => {
      return 'translate(' + source.y0 + ',' + source.x0 + ')';
    })
    .on('click',
    // this.click
    d => {
      console.log('click');
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      this.updateChart(d);
    }
    );

    nodeEnter.append('circle')
    .attr('class', 'node')
    .attr('r', 1e-6)
    .style('fill', (d) => {
      return d._children ? 'lightsteelblue' : '#fff';
    });

    nodeEnter.append('text')
    .attr('dy', '.35em')
    .attr('x', (d) => {
      return d.children || d._children ? -13 : 13;
    })
    .attr('text-anchor', (d) => {
      return d.children || d._children ? 'end' : 'start';
    })
    .style('font', '12px sans-serif')
    .text((d) => { return d.data.name; });

    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
    .duration(this.duration)
    .attr('transform', (d) => {
      return 'translate(' + d.y + ',' + d.x + ')';
    });

    nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style('stroke-width', '3px')
    .style('stroke', 'steelblue')
    .style('fill', (d) => {
      return d._children ? 'lightsteelblue' : '#fff';
    })
    .attr('cursor', 'pointer');

    let nodeExit = node.exit().transition()
    .duration(this.duration)
    .attr('transform', (d) => {
      return 'translate(' + source.y + ',' + source.x + ')';
    })
    .remove();

    nodeExit.select('circle')
    .attr('r', 1e-6);

    nodeExit.select('text')
    .style('fill-opacity', 1e-6);

    let link = this.svg.selectAll('path.link')
    .data(this.links, (d) => { return d.id; });

    let linkEnter = link.enter().insert('path', 'g')
    .attr('class', 'link')
    .style('fill', 'none')
    .style('stroke', '#ccc')
    .style('stroke-width', '2px')
    .attr('d', function (d) {
      let o = { x: source.x0, y: source.y0 };
      return diagonal(o, o);
    });

    let linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
    .duration(this.duration)
    .attr('d', (d) => { return diagonal(d, d.parent); });

    let linkExit = link.exit().transition()
    .duration(this.duration)
    .attr('d', function (d) {
      let o = { x: source.x, y: source.y };
      return diagonal(o, o);
    })
    .remove();

    this.nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    function diagonal(s, d) {
      let path = `M ${s.y} ${s.x}
      C ${(s.y + d.y) / 2} ${s.x},
      ${(s.y + d.y) / 2} ${d.x},
      ${d.y} ${d.x}`;
      return path;
    }
  }

}

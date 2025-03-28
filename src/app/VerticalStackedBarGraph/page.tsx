'use client';

import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { select, Selection } from "d3-selection";
import styles from "../page.module.css";
import { scaleBand, stack } from 'd3';

interface DataItem {
  category: string;
  subgroup: string;
  value: number;
}

const dummyData: DataItem[] = [
  { category: "Group A", subgroup: "Type 1", value: 30 },
  { category: "Group A", subgroup: "Type 2", value: 45 },
  { category: "Group B", subgroup: "Type 1", value: 25 },
  { category: "Group B", subgroup: "Type 2", value: 35 },
  { category: "Group C", subgroup: "Type 1", value: 40 },
  { category: "Group C", subgroup: "Type 2", value: 20 }
];

interface StackedBarChartProps {
  dataSet?: DataItem[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

 const StackedBarChart: React.FC<StackedBarChartProps> = ({
  dataSet = dummyData,
  width = 600,
  height = 400,
  margin = { top: 20, right: 20, bottom: 60, left: 60 }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [selection, setSelection] = useState<Selection<
  any,
  unknown,
  null,
  undefined
> | null>(null);
const [data, setData] = useState(dataSet);

  useEffect(() => {
    if (!svgRef.current) return;

    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      selection.selectAll('*').remove();

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
  
      const categories = [...new Set(data.map(d => d.category))];
      const subGroups = [...new Set(data.map(d => d.subgroup))];
  
      const seriesData = categories.map(category => ({
        category,
        ...subGroups.reduce((acc, subgroup) => {
          acc[subgroup] = data.find(
            d => d.category === category && d.subgroup === subgroup
          )?.value || 0;
          return acc;
        }, {} as Record<string, number>)
      }));
  
      const stackGenerator = stack()
        .keys(subGroups)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
  
      const stackedData = stackGenerator(seriesData as any);
  
      const xScale = scaleBand()
        .domain(categories)
        .range([0, innerWidth])
        .paddingInner(0.1) 
        .paddingOuter(0.2); 
  
      const yScale = d3.scaleLinear()
        .domain([0, 500])
        .range([innerHeight, 0]);
  
      
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
      
      svg.selectAll('.bar')
        .data(stackedData)
        .join('g')
        .attr('class', 'bar')
        .attr('fill', (_, i) => d3.schemeCategory10[i % 10])
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', (d) => xScale((d as any).data.category)!)
        .attr('y', d => yScale((d as any)[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale((d as any)[0]) - yScale((d as any)[1]));
  
      
      const xAxis = d3.axisBottom(xScale);
      svg.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis)
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
        .text('Categories');
  
      const yAxis = d3.axisLeft(yScale);
      svg.append('g')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
        .text('Values');
  
      
      const legend = svg.append('g')
        .attr('transform', `translate(${innerWidth - 200}, 20)`);
  
      subGroups.forEach((subgroup, i) => {
        legend.append('rect')
          .attr('x', 0)
          .attr('y', i * 20)
          .attr('width', 12)
          .attr('height', 12)
          .attr('fill', d3.schemeCategory10[i % 10]);
  
        legend.append('text')
          .attr('x', 16)
          .attr('y', i * 20 + 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'start')
          .attr('fill', '#FFF')
          .text(subgroup);
      });

    }
  }, [selection]);

  return (
    <div className={styles.page}>
      <h1>Stacked Bar Graph v2</h1>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default StackedBarChart;
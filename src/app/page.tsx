'use client';

import { useEffect, useRef, useState } from "react";
import { select,Selection } from "d3-selection";
import styles from "./page.module.css";
import { scaleBand, scaleLinear, tickFormat } from "d3-scale";
import { max } from "d3-array";
import { axisLeft,axisBottom } from "d3-axis";

const data: { name: string; number: number; }[] = [
  {name:'Sam',number:9000},
  {name:'Dave',number:2632},
  {name:'Steve',number:4745},
  {name:'Eve',number:2756},
  {name:'NEd',number:1466}
]


const dimensions = {
   width: 800,
   height: 500,
   chartWidth:700,
   chartHeight:400,
   marginLeft : 100
}

export default function Home() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selection,setSelection] = useState<Selection<any, unknown, null, undefined>>();
  const maxvalue = max(data,d=>d.number);

  const y = scaleLinear().domain([0,maxvalue!]).range([0,dimensions.chartHeight])
  const x = scaleBand().domain(data.map(d=>d.name)).range([0,dimensions.chartWidth]).paddingInner(0.8)


  const yAxis = axisLeft(y).tickFormat( d=> `$ ${d}`).ticks(3);
  const xAxis = axisBottom(x);






  useEffect(()=>{
    if (!svgRef.current || !data) return;

    if(!selection){
      setSelection(select(svgRef.current))
    }else{
      const xAxisGroup = selection.append('g')
      .attr('transform', `translate(${dimensions.marginLeft},${dimensions.chartHeight})`)
      .call(xAxis)

      const yAxisGroup = selection.append('g')
      .attr('transform', `translate(${dimensions.marginLeft},0)`)
      .call(yAxis)


      selection
      .append('g')
      .attr('transform',`translate(${dimensions.marginLeft},0)`)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width',x.bandwidth)
      .attr('x',(_,i)=>{
        const xValue = x(_.name)
        return xValue ? xValue : null
      })
      .attr('fill','orange')
      .attr('height',d => y(d.number))
    }

  },[selection])

  return (
    <div className={styles.page}>
      <h1>Bar Graph</h1>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
      
      <g>
         <rect/>
         <rect/>
         <rect/>
      </g>
      </svg>
    </div>
  );
}

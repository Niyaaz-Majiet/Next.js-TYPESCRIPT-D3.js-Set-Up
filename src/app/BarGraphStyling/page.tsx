"use client";

import { useEffect, useRef, useState } from "react";
import { select, Selection } from "d3-selection";
import styles from "../page.module.css";
import { scaleBand, scaleLinear } from "d3-scale";
import { max } from "d3-array";
import randomstring from "randomstring";
import 'd3-transition'
import { easeElastic } from 'd3-ease';

const dataset: { name: string; units: number }[] = [
  { name: "Bar", units: 23 },
  { name: "Pan", units: 56 },
  { name: "Kit", units: 12 },
  { name: "OOH", units: 34 },
  { name: "DEN", units: 54 },
  { name: "FGR", units: 34 },
];

const dimensions = {
  width: 900,
  height: 600,
  //    chartWidth:700,
  //    chartHeight:400,
  //    marginLeft : 100
};

export default function BarGraphStyling() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selection, setSelection] = useState<Selection<
    any,
    unknown,
    null,
    undefined
  > | null>(null);
  const [data, setData] = useState(dataset);

  let y = scaleLinear()
    .domain([0, max(data, (d) => d.units)!])
    .range([dimensions.height, 0]);

  let x = scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, dimensions.width])
    .padding(0.8);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      selection
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("height", (d) => dimensions.height - y(d.units)!)
        .attr("x", (d) => x(d.name)!)      
        .attr("fill", "orange")
        .attr("height", 0)
        .attr("y", dimensions.height)
        .transition()
        .duration((_,i)=>i*1000)
        .delay(1000)
        .ease(easeElastic)
        .attr("height", (d) => dimensions.height - y(d.units)!)
        .attr("y", (d) => y(d.units))
    }
  }, [selection]);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      y = scaleLinear()
        .domain([0, max(data, (d) => d.units)!])
        .range([dimensions.height, 0]);

      x = scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, dimensions.width])
        .paddingInner(0.05);

      const rect = selection.selectAll("rect").data(data);

      rect.exit()
      .transition().duration(300)
      .attr("y", dimensions.height)
      .attr("height", 0)
      .remove();

      rect.transition().duration(300).delay(100)
        .attr("width", x.bandwidth)
        .attr("height", (d) => dimensions.height - y(d.units)!)
        .attr("x", (d) => x(d.name)!)
        .attr("y", (d) => y(d.units))
        .attr("fill", "orange");

      rect
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("height", (d) => dimensions.height - y(d.units)!)
        .attr("x", (d) => x(d.name)!)
        .attr("fill", "orange")
        .attr("y", dimensions.height)
        .attr("height", 0)
        .transition()
        .duration((_,i)=>i*1000)
        .delay(1000)
        .ease(easeElastic)
        .attr("y", (d) => y(d.units))
        .attr("height", (d) => dimensions.height - y(d.units)!)
    }
  }, [data]);

  const addRandomElement = () => {
    const dataToAdd = {
      name: randomstring.generate(10),
      units: Math.floor(Math.random() * 80 + 20),
    };

    setData([...data, dataToAdd]);
  };

  const removeLastElement = () => {
    if (data.length == 0) {
      return;
    } else {
      const slicedData = data.slice(0, data.length - 1);
      setData(slicedData);
    }
  };

  return (
    <div className={styles.page}>
      <h1>Bar Graph v2</h1>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />

      <button onClick={()=>addRandomElement()}>Add</button>
      <button onClick={()=>removeLastElement()}>Remove</button>
    </div>
  );
}

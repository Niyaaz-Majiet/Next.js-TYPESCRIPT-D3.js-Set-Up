"use client";

import { useEffect, useRef, useState } from "react";
import { select, Selection } from "d3-selection";
import styles from "../page.module.css";
import { easeBounce } from 'd3-ease';

import { transition as d3Transition } from 'd3-transition';

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



  useEffect(() => {
    if (!svgRef.current || !data) return;

    if (!selection) {
      select.prototype.transition = d3Transition;
      setSelection(select(svgRef.current));
    } else {
      selection
      .append('rect')
      .attr('width', 100)
      .attr('height',100)
      .attr('fill','orange')
      .transition()
      .duration(2000)
      .ease(easeBounce)
      .attr('fill',"blue")
      .attr('width', 200)
      .attr('height',400)
    }
  }, [selection]);

  
  return (
    <div className={styles.page}>
      <h1>Bar Graph v2</h1>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
}

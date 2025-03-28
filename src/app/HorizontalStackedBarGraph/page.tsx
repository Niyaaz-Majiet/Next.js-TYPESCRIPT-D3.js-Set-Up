'use client';

import * as d3 from "d3";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3";
import styles from "../page.module.css";

const MARGIN = { top: 0, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.2;
export const COLORS = ["#e85252", "#6689c6", "#9a6fb0"];

const dataSet = [
    {group:"Mark", subgroup: "travel",  value: 90},
    {group:"Mark", subgroup: "food",  value: 23},
    {group:"Mark", subgroup: "beer",  value: 14},
    {group:"Robert", subgroup: "travel",  value: 12},
    {group:"Robert", subgroup: "food",  value: 9},
    {group:"Robert", subgroup: "beer",  value: 2},
    {group:"Emily", subgroup: "travel",  value: 34},
    {group:"Emily", subgroup: "food",  value: 0},
    {group:"Emily", subgroup: "beer",  value: 4},
    {group:"Marion", subgroup: "travel",  value: 53},
    {group:"Marion", subgroup: "food",  value: 14},
    {group:"Marion", subgroup: "beer",  value: 102},
    {group:"Nicolas", subgroup: "travel",  value: 98},
    {group:"Nicolas", subgroup: "food",  value: 9},
    {group:"Nicolas", subgroup: "beer",  value: 8},
    {group:"Mélanie", subgroup: "travel",  value: 23},
    {group:"Mélanie", subgroup: "food",  value: 23},
    {group:"Mélanie", subgroup: "beer",  value: 3},
    {group:"Gabriel", subgroup: "travel",  value: 18},
    {group:"Gabriel", subgroup: "food",  value: 11},
    {group:"Gabriel", subgroup: "beer",  value: 18},
    {group:"Jean", subgroup: "travel",  value: 104},
    {group:"Jean", subgroup: "food",  value: 10},
    {group:"Jean", subgroup: "beer",  value: 14},
    {group:"Paul", subgroup: "travel",  value: 2},
    {group:"Paul", subgroup: "food",  value: 12},
    {group:"Paul", subgroup: "beer",  value: 92},
]

type BarplotProps = {
  width: number;
  height: number;
  data: { group: string; subgroup: string; value: number }[];
};

const Barplot = ({ width = 500, height = 500, data = dataSet }: BarplotProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const groups = [...new Set(data.map((d) => d.group)!)];
  const subGroups = [...new Set(data.map((d) => d.subgroup)!)];

  // Reformat the dataset
  const stackGenerator = d3
    .stack<string>()
    .keys(subGroups)
    .value((d) => data.filter((item) => item.group === d)[0].value);
  const series = stackGenerator(groups);

  // Find size of the longest bar and group rank.
  // Values are available in the last group of the stack
  const lastStackGroup = series[series.length - 1] || [];
  const groupTotalValues = lastStackGroup.map((group) => {
    const biggest = group[group.length - 1] || 0;
    return { name: group.data, value: biggest };
  });
  const sortedGroupTotalValues = groupTotalValues.sort(
    (a, b) => b.value - a.value
  );
  const maxValue = sortedGroupTotalValues[0].value;

  // Y axis is for groups since the barplot is horizontal
  const yScale = scaleBand()
  .domain(groupTotalValues.map((g) => g.name))
  .range([0, boundsHeight])
  .padding(BAR_PADDING);

  // X axis
  const xScale = scaleLinear().domain([0, maxValue]).range([0, boundsWidth]);

  // Color Scale
  var colorScale = scaleOrdinal<string>().domain(subGroups).range(COLORS);

  const rectangles = series.map((subgroup, i) => {
    return (
      <g key={i}>
        {subgroup.map((group, j) => {
          return (
            <rect
              key={j}
              y={yScale(group.data)}
              height={yScale.bandwidth()}
              x={xScale(group[0])}
              width={xScale(group[1]) - xScale(group[0])}
              fill={colorScale(subgroup.key)}
              opacity={0.6}
            />
          );
        })}
      </g>
    );
  });

  const labels = sortedGroupTotalValues.map((group, i) => {
    const y = yScale(group.name);

    if (!y) {
      return null;
    }

    return (
      <g key={i}>
        <text
          x={xScale(group.value) - 7}
          y={y + yScale.bandwidth() / 2}
          textAnchor="end"
          alignmentBaseline="central"
          fontSize={12}
          opacity={xScale(group.value) > 90 ? 1 : 0} // hide label if bar is not wide enough
        >
          {group.value}
        </text>
        <text
          x={xScale(0) + 7}
          y={y + yScale.bandwidth() / 2}
          textAnchor="start"
          alignmentBaseline="central"
          fontSize={12}
        >
          {group.name}
        </text>
      </g>
    );
  });

  const grid = xScale
    .ticks(5)
    .slice(1)
    .map((value, i) => (
      <g key={i}>
        <line
          x1={xScale(value)}
          x2={xScale(value)}
          y1={0}
          y2={boundsHeight}
          stroke="#808080"
          opacity={0.2}
        />
        <text
          x={xScale(value)}
          y={boundsHeight + 10}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={9}
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));

  return (
    <div  className={styles.page}>
        <h1>Horizontal Stacked Bar Graph v2</h1>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          <g>{grid}</g>
          <g>{rectangles}</g>
          <g>{labels}</g>
        </g>
      </svg>
    </div>
  );
};

export default Barplot;

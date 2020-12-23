const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 800)
  .attr('height', 600)
  .style('background-color', 'white');

const margin = { top: 20, right: 10, bottom: 70, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const t = d3.transition().duration(1000);

const graph = svg
  .append('g')
  .attr('width', width)
  .attr('height', height)
  .attr('transform', `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${height})`);
const yAxisGroup = graph.append('g');

// create scales
const y = d3.scaleLinear().range([height, 0]);
const x = d3.scaleBand().range([0, 500]).paddingInner(0.2).paddingOuter(0.2);

// create axis
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

// update func
const update = (data) => {
  // update domains
  y.domain([0, d3.max(data, (d) => d.count)]);
  x.domain(data.map((i) => i.name));

  // join data
  const rects = graph.selectAll('rect').data(data);

  // remove spare nodes
  rects.exit().remove();

  // making rects
  rects
    .attr('fill', (d) => d.color)
    .attr('x', (d) => x(d.name))
    .transition(t)
    .attr('height', (d) => height - y(d.count))
    .attr('y', (d) => y(d.count));

  rects
    .enter()
    .append('rect')
    .attr('height', 0)
    .attr('fill', (d) => d.color)
    .attr('x', (d) => x(d.name))
    .attr('y', height)
    .transition(t)
    .attrTween('width', widthTween)
    .attr('y', (d) => y(d.count))
    .attr('height', (d) => height - y(d.count));

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

let data = [];

db.collection('fruits').onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    let doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex((item) => item.id === doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});

const widthTween = (d) => {
  let i = d3.interpolate(0, x.bandwidth());

  return (t) => {
    return i(t);
  };
};

let zata = [
  { name: 'apple' },
  { name: 'pear' },
  { name: 'orange' },
  { name: 'apple' },
  { name: 'apple' },
  { name: 'orange' },
  { name: 'kiwi' },
  { name: 'apple' },
];

let xata = zata.map((i) => {
  return i.name;
});

const result = xata.reduce(
  (acc, current) => acc.set(current, (acc.get(current) || 0) + 1),
  new Map()
);

var count = {};
xata.forEach(function(i) { count[i] = (count[i]||0) + 1;});
console.log(count);
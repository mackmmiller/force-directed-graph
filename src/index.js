import * as d3 from 'd3';
import './index.css';

let url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
	svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const color = d3.scaleOrdinal(d3.schemeCategory20);

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d,i) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

const div = d3.select("main").append("div")
		.attr("class","tooltip")
		.style("opacity", 0);

d3.json(url, function(error, data) {
	if (error) throw error;
	data.nodes.forEach((d,i)=>d.id=i);
	graph(data);
});

function graph(graph) {
	const dataset = graph;
  	const link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(dataset.links)
    .enter().append("line")
      .attr("stroke-width", 2);

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(dataset.nodes)
    .enter()
   	.append("circle")
      .attr("r", 8)
      .on("mousover", (d)=> {
      	div.transition()
      		.duration(200)
      		.style("opacity", .9);
      	div.html((d) => d.country)
      		.style("left", (d3.event.pageX)+"px")
      		.style("top", (d3.event.pageY-28)+"px")
      })
      .on("mouseout", (d)=> {
      	div.transition()
      		.duration(500)
      		.style("opacity", 0);
      })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("text")
  	.attr("dx", (d)=> -20)
  	.text((d) => d.code);

  node.append("title")
      .text(function(d,i) {return d.country});

  simulation
      .nodes(dataset.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(dataset.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
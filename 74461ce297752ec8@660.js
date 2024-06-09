function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Horizon Chart</h1></div>

# Horizon Chart`
)}

function _bands(Inputs){return(
Inputs.range([2, 8], {step: 1, label: "Bands"})
)}

function _chart(Plot,step,traffic,d3,bands){return(
Plot.plot({
  height: 1100,
  width: 928,
  x: {axis: "top"},
  y: {domain: [0, step], axis: null},
  fy: {axis: null, domain: traffic.map((d) => d.most_collision), padding: 0.05},
  color: {
    type: "ordinal",
    scheme: "Oranges",
    label: "Vehicles per hour",
    tickFormat: (i) => ((i + 1) * step).toLocaleString("en"),
    legend: true
  },
  marks: [
    d3.range(bands).map((band) => Plot.areaY(traffic, {x: "date", y: (d) => d.total_vehicle_num - band * step, fy: "most_collision", fill: band, sort: "date", clip: true})),
    Plot.axisFy({frameAnchor: "left", dx: -28, fill: "currentColor", textStroke: "white", label: null})
  ]
})
)}

function _traffic(FileAttachment){return(
FileAttachment("collisionDataWithMostCollision.csv").csv({typed: true})
)}

function _step(d3,traffic,bands){return(
+(d3.max(traffic, (d) => d.total_vehicle_num * 0.1 ) / bands).toPrecision(2)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["collisionDataWithMostCollision.csv", {url: new URL("./files/07aec3d1aeb724213a590ac5cfbc26bf744cb4f3120cd9e88371cd718d969518c5fb25be317f82a61dec8c43cce8163d5b3cda89b429bbac43a37ce6b975bb91.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof bands")).define("viewof bands", ["Inputs"], _bands);
  main.variable(observer("bands")).define("bands", ["Generators", "viewof bands"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["Plot","step","traffic","d3","bands"], _chart);
  main.variable(observer("traffic")).define("traffic", ["FileAttachment"], _traffic);
  main.variable(observer("step")).define("step", ["d3","traffic","bands"], _step);
  return main;
}

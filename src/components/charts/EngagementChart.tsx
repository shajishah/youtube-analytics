import ReactECharts from "echarts-for-react";


export default function EngagementChart({ data }: { data: any }) {
const option = {
tooltip: {},
legend: { data: ["Likes", "Comments", "Views"] },
xAxis: { type: "category", data: data.labels },
yAxis: { type: "value" },
series: [
{ name: "Likes", type: "line", data: data.likes },
{ name: "Comments", type: "line", data: data.comments },
{ name: "Views", type: "line", data: data.views },
],
};


return <ReactECharts option={option} style={{ height: 300 }} />;
}
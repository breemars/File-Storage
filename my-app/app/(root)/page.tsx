"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { getFiles } from "@/lib/actions/file.actions";
import { useEffect, useState } from "react";

import { LabelList, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import Thumbnail from "@/components/Thumbnail";
import { Models } from "node-appwrite";
import { useRouter } from "next/navigation";
import CardActionsDropdown from "@/components/CardActionsDropdown";

const chartData = [
  {
    type: "documents",
    amount: 0,
    fill: "var(--color-documents)",
  },
  {
    type: "images",
    amount: 0,
    fill: "var(--color-images)",
  },

  {
    type: "video",
    amount: 0,
    fill: "var(--color-video)",
  },
  {
    type: "audio",
    amount: 0,
    fill: "var(--color-audio)",
  },
  {
    type: "other",
    amount: 0,
    fill: "var(--color-other)",
  },
];

const chartConfig = {
  images: {
    label: "Images",
    color: "var(--color-purple-400)",
  },
  documents: {
    label: "Docs",
    color: "var(--color-blue-400)",
  },
  video: {
    label: "Video",
    color: "var(--color-orange-400)",
  },
  audio: {
    label: "Audio",
    color: "var(--color-green-400)",
  },
  other: {
    label: "Other",
    color: "var(--color-pink-400)",
  },
} satisfies ChartConfig;

const totalChartData = [
  { amount: 50000000000000000000000, fill: "var(--color-primary)" },
];

const Page = () => {
  const [totalUsedSpace, setTotalUsedSpace] = useState(0);
  const [results, setResults] = useState<Models.DefaultRow[]>([]);
  const router = useRouter();
  const [updatedChartData, setUpdatedChartData] = useState(chartData);

  //Gets the file size data and stores the files to display the most recent ones
  useEffect(() => {
    const fetchData = async () => {
      const files = await getFiles({});
      setResults(files.rows);
      setTotalUsedSpace(files.totalUsedSpace);

      const updatedData = chartData.map((item) => ({
        ...item,
        amount: files.typesUsedSpace[item.type].size,
      }));
      setUpdatedChartData(updatedData);
    };
    fetchData();
  }, []);

  //Displays the search results when a dropdown result is click
  const handleClickItem = (file: Models.DefaultRow) => {
    router.push(
      `/${file.type === "video" || file.type == "audio" ? "media" : file.type}?query=${file.name}`,
    );
  };

  return (
    <div className="md:flex md:flex-row">
      <div className="flex flex-col gap-10">
        <div className=" max-w-125 p-6 rounded-lg bg-primary border border-t-0 shadow-lg text-white">
          <h1>Welcome Back!</h1>
        </div>
        <div className="flex flex-col gap-5 max-w-125 p-6 rounded-lg bg-white border border-t-0 shadow-lg">
          <h3>Total Storage Used by File Type</h3>

          {updatedChartData.length > 0 ? (
            updatedChartData.map((data) => (
              <p key={data.type} className="capitalize">
                {data.type} - <b>{data.amount} MB</b>
              </p>
            ))
          ) : (
            <p>No data available</p>
          )}
          <hr></hr>
          <h3>
            Total - <b>{totalUsedSpace} MB</b>
          </h3>
        </div>
      </div>

      <div className="flex flex-col">
        <Card className="w-75 flex flex-col rounded-none ring-foreground/0 bg-gray-100">
          <CardContent className="flex h-55 pb-0 border-none">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-55"
            >
              <RadialBarChart
                data={totalChartData}
                startAngle={90}
                endAngle={90 - (totalUsedSpace / 2048) * 360}
                innerRadius={70}
                outerRadius={100}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-[#cdced0] last:fill-gray-100"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="amount" background />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {((totalUsedSpace / 2028) * 100).toFixed(0)}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Storage Used
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="w-75 flex flex-col justify-center p-0 m-0 rounded-none ring-foreground/0 [--card-spacing:0] bg-gray-100">
          <CardContent className="flex justify-center h-70 p-0 m-0">
            <ChartContainer
              config={chartConfig}
              className="mx-0 aspect-square max-h-70 [&_.recharts-text]:fill-black"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="type" hideLabel />}
                />
                <Pie
                  data={updatedChartData}
                  dataKey="amount"
                  className="stroke-3 stroke-gray-100"
                  stroke="#000"
                >
                  <LabelList
                    dataKey="type"
                    className="fill-black"
                    fontSize={14}
                    formatter={(value) =>
                      chartConfig[value as keyof typeof chartConfig]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className=" max-w-125 p-6 rounded-lg bg-white border border-t-0 shadow-lg">
        <h3 className="pb-3">Recent Uploads</h3>
        <ul>
          {results.length > 0 ? (
            results.slice(0, 6).map((file) => (
              <li
                key={file.$id}
                className="flex flex-row gap-3 justify-between items-center  hover:bg-gray-200 p-2 rounded-3xl"
              >
                <span
                  className="flex flex-row gap-3 items-center "
                  onClick={() => handleClickItem(file)}
                >
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />
                  <p className="line-clamp-2">{file.name}</p>
                </span>
                <CardActionsDropdown file={file} />
              </li>
            ))
          ) : (
            <li>No files uploaded</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Page;

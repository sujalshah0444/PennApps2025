import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";

export default function AboutTab() {
  const [totalQueries, setTotalQueries] = useState(0);

  const perQueryData = [
    { name: "Google median", value: 0.03 },
    { name: "Conservative est.", value: 2.0 },
    { name: "Common estimate", value: 3.5 },
  ];

  const datacenterTrend = [
    { year: 2020, value: 1.0 },
    { year: 2022, value: 1.2 },
    { year: 2024, value: 1.8 },
    { year: 2026, value: 2.0 },
    { year: 2028, value: 2.5 },
    { year: 2030, value: 3.0 },
  ];

  const trainingVsInference = [
    { phase: "Training (example)", value: 300000 },
    { phase: "Inference (annualized)", value: 120000 },
  ];

  // Animate demo queries number
  useEffect(() => {
    let tq = 0;
    const targetTQ = 1250000;
    const int = setInterval(() => {
      tq += Math.ceil(targetTQ / 60);
      setTotalQueries(Math.min(tq, targetTQ));
      if (tq >= targetTQ) clearInterval(int);
    }, 40);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Intro */}
      <motion.div
        className="card w-full p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-green-700 mb-3">
          About Type-less 🌍
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Type-less helps users shorten and clarify prompts for large AI models,
          reducing energy per request and lowering the cumulative carbon impact.
          Below, you can scroll through key statistics, charts, and real
          research findings about AI’s environmental footprint.
        </p>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Demo total queries since launch</p>
          <p className="text-2xl font-extrabold text-green-600">
            {totalQueries.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Section 1: Per-query emissions */}
      <motion.div
        className="card w-full p-6 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold">Per-query emissions (gCO₂)</h3>
        <p className="text-gray-600 text-sm">
          Every AI query consumes energy and produces carbon emissions. Different
          studies give different estimates — from Google’s own low figures to
          independent reports showing several grams per query.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={perQueryData}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit=" gCO₂" />
            <Tooltip formatter={(value) => `${value} gCO₂`} />
            <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500">
          Source:{" "}
          <a
            href="https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference"
            className="underline text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Cloud
          </a>
          ,{" "}
          <a
            href="https://smartly.ai/blog/the-carbon-footprint-of-chatgpt-how-much-co2-does-a-query-generate"
            className="underline text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Independent estimates
          </a>
        </p>
      </motion.div>

      {/* Section 2: Data-centre electricity trend */}
      <motion.div
        className="card w-full p-6 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold">
          Data-centre electricity share
        </h3>
        <p className="text-gray-600 text-sm">
          Datacentres already consume nearly 2% of global electricity. With the
          rapid growth of AI workloads, this share is expected to rise sharply
          in the coming decade.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={datacenterTrend}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500">
          Source:{" "}
          <a
            href="https://www.carbonbrief.org/ai-five-charts-that-put-data-centre-energy-use-and-emissions-into-context"
            className="underline text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            CarbonBrief & IEA
          </a>
        </p>
      </motion.div>

      {/* Section 3: Training vs inference */}
      <motion.div
        className="card w-full p-6 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold">Training vs. inference</h3>
        <p className="text-gray-600 text-sm">
          Training a large AI model is carbon-intensive, but inference (everyday
          use by millions of people) can surpass training emissions over time.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={trainingVsInference}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="phase" />
            <YAxis />
            <Tooltip
              formatter={(value) => `${value.toLocaleString()} kgCO₂-e`}
            />
            <Bar dataKey="value" fill="#F97316" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500">
          Source:{" "}
          <a
            href="https://arxiv.org/html/2507.11417v1"
            className="underline text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Recent research
          </a>
        </p>
      </motion.div>
    </div>
  );
}


import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const aircraftTypeData = [
  { name: "Commercial", value: 40 },
  { name: "Military", value: 25 },
  { name: "Private", value: 20 },
  { name: "Drone", value: 15 }
];

const countryData = [
  { name: "USA", count: 12 },
  { name: "Russia", count: 8 },
  { name: "EU", count: 7 },
  { name: "China", count: 5 },
  { name: "Others", count: 3 }
];

const accuracyData = [
  { name: "Boeing 747", accuracy: 98.5 },
  { name: "Airbus A380", accuracy: 97.8 },
  { name: "F-22 Raptor", accuracy: 94.2 },
  { name: "DJI Mavic", accuracy: 96.7 },
  { name: "Cessna 172", accuracy: 91.3 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const Analytics = () => {
  // Only show when user has 5 or more uploads
  const totalUploads = 12;
  const showAnalytics = totalUploads >= 5;

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">AI Analytics</h1>
              <p className="text-muted-foreground">
                Insights from your aircraft identification history
              </p>
            </div>
            <div className="glass-panel px-4 py-2 rounded-full">
              <p className="text-sm">
                Total uploads: <span className="font-bold">{totalUploads}</span>
              </p>
            </div>
          </div>

          {showAnalytics ? (
            <>
              <Tabs defaultValue="summary" className="mb-8">
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="glass-panel">
                      <CardHeader>
                        <CardTitle>Aircraft Types</CardTitle>
                        <CardDescription>Distribution by aircraft category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={aircraftTypeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {aircraftTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="glass-panel">
                      <CardHeader>
                        <CardTitle>Country of Origin</CardTitle>
                        <CardDescription>Aircraft manufacturers by country</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={countryData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ background: '#111', border: 'none' }} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="accuracy" className="mt-6">
                  <Card className="glass-panel">
                    <CardHeader>
                      <CardTitle>Model Accuracy</CardTitle>
                      <CardDescription>
                        AI confidence scores by aircraft model
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={accuracyData}
                          layout="vertical"
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis type="number" domain={[80, 100]} stroke="#888" />
                          <YAxis dataKey="name" type="category" stroke="#888" />
                          <Tooltip contentStyle={{ background: '#111', border: 'none' }} />
                          <Legend />
                          <Bar dataKey="accuracy" name="Confidence (%)" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trends" className="mt-6">
                  <div className="glass-card p-8 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Historical trend analysis will be available with more upload data.
                      Continue using FlightLens AI to unlock more insights.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="glass-panel p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">AI System Performance</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard title="Average Detection Time" value="1.2s" description="Time to analyze and identify aircraft" />
                    <MetricCard title="Average Confidence" value="94.7%" description="Model confidence across all detections" />
                    <MetricCard title="Most Common Aircraft" value="Boeing 747" description="Most frequently detected model" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              className="glass-card p-8 rounded-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">Analytics Coming Soon</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Upload {5 - totalUploads} more images to unlock your personalized AI analytics dashboard
              </p>
              <div className="w-full max-w-md mx-auto h-40 border border-dashed border-primary/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Your analytics will appear here</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
}

const MetricCard = ({ title, value, description }: MetricCardProps) => (
  <div className="bg-black/20 p-4 rounded-lg">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold my-1">{value}</p>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);

export default Analytics;

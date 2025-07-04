import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { useState, useEffect } from "react";

export function meta() {
  return [
    { title: "Reports - WCINYP Admin" },
    { name: "description", content: "Analytics and insights dashboard" },
  ];
}

export default function ReportsRoute() {
  const [reports, setReports] = useState([
    { 
      id: 1, 
      name: "Monthly Patient Volume", 
      type: "Analytics",
      lastRun: "2025-07-01",
      status: "completed"
    },
    { 
      id: 2, 
      name: "Provider Productivity", 
      type: "Performance",
      lastRun: "2025-06-30",
      status: "completed"
    },
    { 
      id: 3, 
      name: "Insurance Claims Summary", 
      type: "Financial",
      lastRun: "2025-07-02",
      status: "processing"
    },
    { 
      id: 4, 
      name: "Equipment Utilization", 
      type: "Operations",
      lastRun: "2025-06-28",
      status: "completed"
    },
  ]);
  
  const [stats, setStats] = useState({
    totalReports: 24,
    scheduledReports: 8,
    completedThisMonth: 156,
    averageRunTime: "2.3 minutes"
  });
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-2">
          Analytics and insights for medical imaging operations
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalReports}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.scheduledReports}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.completedThisMonth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Run Time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.averageRunTime}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex gap-4">
        <Button>Create Report</Button>
        <Button variant="outline">Schedule Report</Button>
      </div>
      
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription>
                    {report.type} • Last run: {report.lastRun}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    report.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    Run Now
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { ErrorBoundary };
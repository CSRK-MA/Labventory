import { useState } from "react";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function Reports() {
  const [reportType, setReportType] = useState("Equipment Usage");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [format, setFormat] = useState("PDF");

  const reports = [
    { name: "Equipment Usage Report", date: "November 2024", size: "245 KB" },
    { name: "Chemical Inventory Report", date: "November 2024", size: "189 KB" },
    { name: "Maintenance Summary", date: "November 2024", size: "156 KB" },
    { name: "Check-in/Out Logs", date: "November 2024", size: "312 KB" }
  ];

  const handleGenerateReport = () => {
    toast.success(`Generating ${reportType} report as ${format}...`);
    setTimeout(() => {
      toast.success(`${reportType} report generated successfully!`);
    }, 1500);
  };

  const handleDownloadReport = (reportName: string) => {
    toast.success(`Downloading ${reportName}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download comprehensive reports</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <FileText className="w-8 h-8 text-blue-600 mb-3" />
          <div className="text-3xl text-gray-900 mb-1">24</div>
          <div className="text-sm text-gray-600">Generated This Month</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <Download className="w-8 h-8 text-green-600 mb-3" />
          <div className="text-3xl text-gray-900 mb-1">156</div>
          <div className="text-sm text-gray-600">Total Downloads</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
          <div className="text-3xl text-gray-900 mb-1">8</div>
          <div className="text-sm text-gray-600">Scheduled Reports</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl text-gray-900 mb-6">Generate New Report</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option>Equipment Usage</option>
              <option>Chemical Inventory</option>
              <option>Maintenance Summary</option>
              <option>Check-in/Out Logs</option>
              <option>User Activity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Format</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setFormat("PDF")}
                className={`flex-1 px-4 py-3 border-2 rounded-lg transition-colors ${
                  format === "PDF" ? "bg-blue-50 text-blue-700 border-blue-600" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                PDF
              </button>
              <button 
                onClick={() => setFormat("CSV")}
                className={`flex-1 px-4 py-3 border-2 rounded-lg transition-colors ${
                  format === "CSV" ? "bg-blue-50 text-blue-700 border-blue-600" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                CSV
              </button>
              <button 
                onClick={() => setFormat("Excel")}
                className={`flex-1 px-4 py-3 border-2 rounded-lg transition-colors ${
                  format === "Excel" ? "bg-blue-50 text-blue-700 border-blue-600" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                Excel
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleGenerateReport}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl text-gray-900">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report, index) => (
            <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900">{report.name}</div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {report.date}
                    </span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDownloadReport(report.name)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

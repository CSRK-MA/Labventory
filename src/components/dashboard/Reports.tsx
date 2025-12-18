import { useState, useCallback } from "react";
import { FileText, Download, Calendar, TrendingUp, Loader } from "lucide-react";
import { toast } from "sonner";
import {
  generateEquipmentUsageReport,
  generateChemicalInventoryReport,
  generateCheckInOutReport,
  generateMaintenanceReport,
  exportReportAsPDF,
  exportReportAsCSV,
} from "../../services/reportService";

export function Reports() {
  const [reportType, setReportType] = useState("Equipment Usage Report");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [format, setFormat] = useState("PDF");
  const [filterLocation, setFilterLocation] = useState("");
  const [includeHidden, setIncludeHidden] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState([
    { name: "Equipment Usage Report", date: "November 2024", size: "245 KB" },
    { name: "Chemical Inventory Report", date: "November 2024", size: "189 KB" },
    { name: "Maintenance Summary", date: "November 2024", size: "156 KB" },
    { name: "Check-in/Out Logs", date: "November 2024", size: "312 KB" }
  ]);

  const handleGenerateReport = useCallback(async () => {
    setIsGenerating(true);
    try {
      let reportData;
      
      switch (reportType) {
        case "Equipment Usage Report":
          reportData = await generateEquipmentUsageReport(
            includeHidden,
            filterLocation || undefined
          );
          break;
        case "Chemical Inventory Report":
          reportData = await generateChemicalInventoryReport();
          break;
        case "Check-in/Out Logs":
          reportData = await generateCheckInOutReport();
          break;
        case "Maintenance Summary":
          reportData = await generateMaintenanceReport();
          break;
        default:
          reportData = await generateEquipmentUsageReport();
      }

      if (format === "PDF") {
        const result = await exportReportAsPDF(reportData, reportType);
        if (result.success) {
          toast.success(`✅ ${reportType} generated successfully!`);
          // Add to recent reports
          const newReport = {
            name: reportType,
            date: new Date().toLocaleDateString(),
            size: "Generated"
          };
          setRecentReports([newReport, ...recentReports.slice(0, 3)]);
        } else {
          toast.error("Failed to generate PDF report");
        }
      } else if (format === "CSV") {
        const result = exportReportAsCSV(reportData, reportType);
        if (result.success) {
          toast.success(`✅ ${reportType} exported as CSV successfully!`);
          // Add to recent reports
          const newReport = {
            name: reportType,
            date: new Date().toLocaleDateString(),
            size: "Generated"
          };
          setRecentReports([newReport, ...recentReports.slice(0, 3)]);
        } else {
          toast.error("Failed to export CSV report");
        }
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("An error occurred while generating the report");
    } finally {
      setIsGenerating(false);
    }
  }, [reportType, format, filterLocation, includeHidden, recentReports]);

  const handleDownloadReport = (reportName: string) => {
    toast.info(`Downloading ${reportName}...`);
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
              <option>Equipment Usage Report</option>
              <option>Chemical Inventory Report</option>
              <option>Maintenance Summary</option>
              <option>Check-in/Out Logs</option>
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
          {reportType === "Equipment Usage Report" && (
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Filter by Location (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g., Room 101, Lab A"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Include Hidden Equipment</label>
                <div className="flex items-center gap-3 h-12">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={includeHidden}
                      onChange={(e) => setIncludeHidden(e.target.checked)}
                      className="w-5 h-5 border border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Show hidden from reports</span>
                  </label>
                </div>
              </div>
            </>
          )}
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
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Report"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl text-gray-900">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentReports.map((report, index) => (
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

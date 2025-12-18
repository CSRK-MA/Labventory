import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  getEquipment,
  getChemicals,
  getCheckInOutHistory,
  getMaintenanceRecords,
} from './firebaseService';
import type { Equipment, Chemical, CheckInOut, Maintenance } from './firebaseService';

interface ReportOptions {
  reportType: string;
  dateRange: string;
  format: string;
}

interface ReportData {
  equipment?: Equipment[];
  chemicals?: Chemical[];
  checkInOuts?: CheckInOut[];
  maintenance?: Maintenance[];
  generatedDate: string;
  dateRange: string;
}

/**
 * Generate Equipment Usage Report
 * @param includeHidden - If false (default), excludes equipment marked as hideFromReports
 * @param filterLocation - Optional: filter by specific location
 */
export const generateEquipmentUsageReport = async (
  includeHidden: boolean = false,
  filterLocation?: string
): Promise<ReportData> => {
  let equipment = await getEquipment();
  
  // Filter out hidden equipment unless explicitly requested
  if (!includeHidden) {
    equipment = equipment.filter(eq => !eq.hideFromReports);
  }
  
  // Filter by location if specified
  if (filterLocation) {
    equipment = equipment.filter(eq => 
      eq.location.toLowerCase() === filterLocation.toLowerCase()
    );
  }
  
  return {
    equipment,
    generatedDate: new Date().toLocaleDateString(),
    dateRange: 'All Records',
  };
};

/**
 * Generate Chemical Inventory Report
 */
export const generateChemicalInventoryReport = async (): Promise<ReportData> => {
  const chemicals = await getChemicals();
  return {
    chemicals,
    generatedDate: new Date().toLocaleDateString(),
    dateRange: 'Current Inventory',
  };
};

/**
 * Generate Check-in/Out Logs Report
 */
export const generateCheckInOutReport = async (): Promise<ReportData> => {
  const checkInOuts = await getCheckInOutHistory();
  return {
    checkInOuts,
    generatedDate: new Date().toLocaleDateString(),
    dateRange: 'All Transactions',
  };
};

/**
 * Generate Maintenance Summary Report
 */
export const generateMaintenanceReport = async (): Promise<ReportData> => {
  const maintenance = await getMaintenanceRecords();
  return {
    maintenance,
    generatedDate: new Date().toLocaleDateString(),
    dateRange: 'All Maintenance Records',
  };
};

/**
 * Export report as PDF
 */
export const exportReportAsPDF = async (
  reportData: ReportData,
  reportType: string
) => {
  try {
    // Create HTML content based on report type
    const htmlContent = generateHTMLContent(reportData, reportType);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-10000px';
    container.style.width = '1200px';
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      allowTaint: true,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    const fileName = `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error };
  }
};

/**
 * Export report as CSV
 */
export const exportReportAsCSV = (reportData: ReportData, reportType: string) => {
  try {
    let csvContent = '';

    // Add header
    csvContent += `${reportType} Report\n`;
    csvContent += `Generated: ${reportData.generatedDate}\n`;
    csvContent += `Date Range: ${reportData.dateRange}\n\n`;

    // Add data based on report type
    if (reportData.equipment) {
      csvContent += generateEquipmentCSV(reportData.equipment);
    } else if (reportData.chemicals) {
      csvContent += generateChemicalCSV(reportData.chemicals);
    } else if (reportData.checkInOuts) {
      csvContent += generateCheckInOutCSV(reportData.checkInOuts);
    } else if (reportData.maintenance) {
      csvContent += generateMaintenanceCSV(reportData.maintenance);
    }

    // Download CSV
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
    );
    const fileName = `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    return { success: true, fileName };
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return { success: false, error };
  }
};

/**
 * Generate HTML content for different report types
 */
const generateHTMLContent = (reportData: ReportData, reportType: string): string => {
  const styles = `
    <style>
      * { margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; color: #333; }
      .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; padding: 40px 20px; text-align: center; }
      .header h1 { font-size: 28px; margin-bottom: 10px; }
      .header p { font-size: 14px; opacity: 0.9; }
      .info { display: flex; justify-content: space-between; padding: 20px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb; }
      .info-item { text-align: center; }
      .info-item label { display: block; font-size: 12px; color: #6b7280; margin-bottom: 5px; }
      .info-item value { display: block; font-weight: bold; font-size: 16px; color: #1f2937; }
      table { width: 100%; border-collapse: collapse; margin-top: 30px; }
      th { background: #f3f4f6; padding: 15px; text-align: left; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
      td { padding: 12px 15px; border-bottom: 1px solid #e5e7eb; }
      tr:nth-child(even) { background: #f9fafb; }
      .summary { margin-top: 30px; padding: 20px; background: #f0f9ff; border-left: 4px solid #2563eb; }
      .summary h3 { color: #1e40af; margin-bottom: 10px; }
      .summary p { font-size: 14px; color: #1e3a8a; margin: 5px 0; }
    </style>
  `;

  let content = `
    ${styles}
    <div class="header">
      <h1>${reportType} Report</h1>
      <p>Lab Inventory Management System</p>
    </div>
    <div class="info">
      <div class="info-item">
        <label>Generated Date</label>
        <value>${reportData.generatedDate}</value>
      </div>
      <div class="info-item">
        <label>Date Range</label>
        <value>${reportData.dateRange}</value>
      </div>
      <div class="info-item">
        <label>Report Type</label>
        <value>${reportType}</value>
      </div>
    </div>
  `;

  if (reportData.equipment && reportData.equipment.length > 0) {
    content += `
      <table>
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Location</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.equipment
            .map(
              (eq) => `
            <tr>
              <td>${eq.name}</td>
              <td>${eq.category}</td>
              <td>${eq.quantity}</td>
              <td><span style="padding: 5px 10px; border-radius: 4px; background: ${getStatusColor(eq.status)}; color: white;">${eq.status}</span></td>
              <td>${eq.location}</td>
              <td>${eq.condition || 'N/A'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div class="summary">
        <h3>Equipment Summary</h3>
        <p>Total Equipment: ${reportData.equipment.length}</p>
        <p>Available: ${reportData.equipment.filter((e) => e.status === 'Available').length}</p>
        <p>In Use: ${reportData.equipment.filter((e) => e.status === 'In Use').length}</p>
        <p>Maintenance: ${reportData.equipment.filter((e) => e.status === 'Maintenance').length}</p>
      </div>
    `;
  }

  if (reportData.chemicals && reportData.chemicals.length > 0) {
    content += `
      <table>
        <thead>
          <tr>
            <th>Chemical Name</th>
            <th>Formula</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Hazard Level</th>
            <th>Location</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.chemicals
            .map(
              (chem) => `
            <tr>
              <td>${chem.name}</td>
              <td>${chem.formula}</td>
              <td>${chem.quantity}</td>
              <td>${chem.unit}</td>
              <td><span style="padding: 5px 10px; border-radius: 4px; background: ${getHazardColor(chem.hazardLevel)}; color: white;">${chem.hazardLevel}</span></td>
              <td>${chem.location}</td>
              <td>${chem.expiryDate ? formatDate(chem.expiryDate) : 'N/A'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div class="summary">
        <h3>Chemical Summary</h3>
        <p>Total Chemicals: ${reportData.chemicals.length}</p>
        <p>High Hazard: ${reportData.chemicals.filter((c) => c.hazardLevel === 'High').length}</p>
        <p>Medium Hazard: ${reportData.chemicals.filter((c) => c.hazardLevel === 'Medium').length}</p>
        <p>Low Hazard: ${reportData.chemicals.filter((c) => c.hazardLevel === 'Low').length}</p>
      </div>
    `;
  }

  if (reportData.checkInOuts && reportData.checkInOuts.length > 0) {
    content += `
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>User</th>
            <th>Action</th>
            <th>Quantity</th>
            <th>Timestamp</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.checkInOuts
            .map(
              (log) => `
            <tr>
              <td>${log.itemName}</td>
              <td>${log.itemType}</td>
              <td>${log.userName}</td>
              <td><span style="padding: 5px 10px; border-radius: 4px; background: ${log.action === 'check-in' ? '#10b981' : '#f59e0b'}; color: white;">${log.action}</span></td>
              <td>${log.quantity}</td>
              <td>${formatDateTime(log.timestamp)}</td>
              <td>${log.purpose || 'N/A'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div class="summary">
        <h3>Transaction Summary</h3>
        <p>Total Transactions: ${reportData.checkInOuts.length}</p>
        <p>Check-ins: ${reportData.checkInOuts.filter((log) => log.action === 'check-in').length}</p>
        <p>Check-outs: ${reportData.checkInOuts.filter((log) => log.action === 'check-out').length}</p>
      </div>
    `;
  }

  if (reportData.maintenance && reportData.maintenance.length > 0) {
    content += `
      <table>
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Type</th>
            <th>Status</th>
            <th>Description</th>
            <th>Scheduled Date</th>
            <th>Completed Date</th>
            <th>Technician</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.maintenance
            .map(
              (maint) => `
            <tr>
              <td>${maint.equipmentName}</td>
              <td>${maint.type}</td>
              <td><span style="padding: 5px 10px; border-radius: 4px; background: ${getMaintenanceStatusColor(maint.status)}; color: white;">${maint.status}</span></td>
              <td>${maint.description}</td>
              <td>${formatDate(maint.scheduledDate)}</td>
              <td>${maint.completedDate ? formatDate(maint.completedDate) : 'N/A'}</td>
              <td>${maint.technician || 'N/A'}</td>
              <td>${maint.cost ? `$${maint.cost.toFixed(2)}` : 'N/A'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div class="summary">
        <h3>Maintenance Summary</h3>
        <p>Total Records: ${reportData.maintenance.length}</p>
        <p>Pending: ${reportData.maintenance.filter((m) => m.status === 'Pending').length}</p>
        <p>In Progress: ${reportData.maintenance.filter((m) => m.status === 'In Progress').length}</p>
        <p>Completed: ${reportData.maintenance.filter((m) => m.status === 'Completed').length}</p>
        <p>Total Cost: $${reportData.maintenance.reduce((sum, m) => sum + (m.cost || 0), 0).toFixed(2)}</p>
      </div>
    `;
  }

  return content;
};

/**
 * Helper functions for CSV generation
 */
const generateEquipmentCSV = (equipment: Equipment[]): string => {
  const headers = ['Equipment Name', 'Category', 'Quantity', 'Status', 'Location', 'Condition', 'Purchase Date', 'Last Maintenance'];
  const rows = equipment.map((eq) => [
    eq.name,
    eq.category,
    eq.quantity.toString(),
    eq.status,
    eq.location,
    eq.condition || 'N/A',
    eq.purchaseDate ? formatDate(eq.purchaseDate) : 'N/A',
    eq.lastMaintenance ? formatDate(eq.lastMaintenance) : 'N/A',
  ]);

  return buildCSVString(headers, rows);
};

const generateChemicalCSV = (chemicals: Chemical[]): string => {
  const headers = ['Chemical Name', 'Formula', 'Quantity', 'Unit', 'Hazard Level', 'Location', 'Expiry Date', 'Supplier'];
  const rows = chemicals.map((chem) => [
    chem.name,
    chem.formula,
    chem.quantity.toString(),
    chem.unit,
    chem.hazardLevel,
    chem.location,
    chem.expiryDate ? formatDate(chem.expiryDate) : 'N/A',
    chem.supplier || 'N/A',
  ]);

  return buildCSVString(headers, rows);
};

const generateCheckInOutCSV = (logs: CheckInOut[]): string => {
  const headers = ['Item Name', 'Item Type', 'User', 'User Email', 'Action', 'Quantity', 'Timestamp', 'Purpose'];
  const rows = logs.map((log) => [
    log.itemName,
    log.itemType,
    log.userName,
    log.userEmail,
    log.action,
    log.quantity.toString(),
    formatDateTime(log.timestamp),
    log.purpose || 'N/A',
  ]);

  return buildCSVString(headers, rows);
};

const generateMaintenanceCSV = (maintenance: Maintenance[]): string => {
  const headers = ['Equipment', 'Type', 'Status', 'Description', 'Scheduled Date', 'Completed Date', 'Technician', 'Cost'];
  const rows = maintenance.map((maint) => [
    maint.equipmentName,
    maint.type,
    maint.status,
    maint.description,
    formatDate(maint.scheduledDate),
    maint.completedDate ? formatDate(maint.completedDate) : 'N/A',
    maint.technician || 'N/A',
    maint.cost ? `$${maint.cost.toFixed(2)}` : 'N/A',
  ]);

  return buildCSVString(headers, rows);
};

const buildCSVString = (headers: string[], rows: (string | number)[][]): string => {
  const csvHeaders = headers.map((h) => `"${h}"`).join(',');
  const csvRows = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  return `${csvHeaders}\n${csvRows}\n`;
};

/**
 * Helper function to safely convert date values
 */
const formatDate = (value: any): string => {
  if (!value) return 'N/A';
  
  // Handle Firestore Timestamp objects
  if (value.toDate && typeof value.toDate === 'function') {
    return value.toDate().toLocaleDateString();
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  // Handle string dates
  if (typeof value === 'string') {
    return new Date(value).toLocaleDateString();
  }
  
  // Handle timestamps (numbers)
  if (typeof value === 'number') {
    return new Date(value).toLocaleDateString();
  }
  
  return 'N/A';
};

const formatDateTime = (value: any): string => {
  if (!value) return 'N/A';
  
  // Handle Firestore Timestamp objects
  if (value.toDate && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  
  // Handle string dates
  if (typeof value === 'string') {
    return new Date(value).toLocaleString();
  }
  
  // Handle timestamps (numbers)
  if (typeof value === 'number') {
    return new Date(value).toLocaleString();
  }
  
  return 'N/A';
};

/**
 * Color helper functions
 */
const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    Available: '#10b981',
    'In Use': '#3b82f6',
    Maintenance: '#f59e0b',
    Retired: '#ef4444',
  };
  return colors[status] || '#6b7280';
};

const getHazardColor = (level: string): string => {
  const colors: { [key: string]: string } = {
    Low: '#10b981',
    Medium: '#f59e0b',
    High: '#ef4444',
  };
  return colors[level] || '#6b7280';
};

const getMaintenanceStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    Pending: '#f59e0b',
    'In Progress': '#3b82f6',
    Completed: '#10b981',
  };
  return colors[status] || '#6b7280';
};

// src/components/qr/QRGenerator.jsx
// QR Code Generator for Equipment and Chemicals

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Copy, Check } from 'lucide-react';

/**
 * QR Code Generator Component
 * @param {Object} item - Equipment or chemical object
 * @param {string} type - 'equipment' or 'chemical'
 */
export function QRGenerator({ item, type = 'equipment' }) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  // Generate QR data payload
  const qrData = JSON.stringify({
    id: item.id,
    type: type,
    code: item.itemCode || item.chemicalCode,
    name: item.itemName || item.chemicalName,
    timestamp: new Date().toISOString()
  });

  // Copy QR data to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Download QR code as PNG
  const handleDownload = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${item.itemCode || item.chemicalCode}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Print QR code
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${item.itemCode || item.chemicalCode}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              padding: 20px;
            }
            h2 { margin: 10px 0; }
            p { margin: 5px 0; color: #666; }
            @media print {
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>${item.itemName || item.chemicalName}</h2>
            <p>${item.itemCode || item.chemicalCode}</p>
            <div style="margin: 20px 0;">
              ${svgData}
            </div>
            <p>Scan to view details and check-in/out</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg text-gray-900 mb-4">QR Code</h3>
      
      {/* QR Code Display */}
      <div ref={qrRef} className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
        <QRCodeSVG
          value={qrData}
          size={200}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: '/lab-icon.png',
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>

      {/* Item Info */}
      <div className="mt-4 text-sm">
        <div className="text-gray-600">
          <span className="text-gray-900">{item.itemName || item.chemicalName}</span>
        </div>
        <div className="text-gray-500">
          Code: {item.itemCode || item.chemicalCode}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Data'}
        </button>
      </div>

      {/* Data Preview */}
      <details className="mt-4">
        <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
          View QR Data
        </summary>
        <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
          {JSON.stringify(JSON.parse(qrData), null, 2)}
        </pre>
      </details>
    </div>
  );
}

/**
 * Batch QR Code Generator
 * Generate QR codes for multiple items at once
 */
export function BatchQRGenerator({ items, type = 'equipment' }) {
  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    
    const qrCodes = items.map(item => {
      const qrData = JSON.stringify({
        id: item.id,
        type: type,
        code: item.itemCode || item.chemicalCode,
        name: item.itemName || item.chemicalName,
        timestamp: new Date().toISOString()
      });

      return `
        <div class="qr-item">
          <h3>${item.itemName || item.chemicalName}</h3>
          <p>${item.itemCode || item.chemicalCode}</p>
          <div id="qr-${item.id}"></div>
        </div>
      `;
    }).join('');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Batch QR Codes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .qr-item {
              display: inline-block;
              text-align: center;
              padding: 15px;
              margin: 10px;
              border: 2px solid #ddd;
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .qr-item h3 {
              margin: 0 0 5px 0;
              font-size: 14px;
            }
            .qr-item p {
              margin: 0 0 10px 0;
              font-size: 12px;
              color: #666;
            }
            @media print {
              @page { margin: 1cm; }
              .qr-item { break-inside: avoid; }
            }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
        </head>
        <body>
          ${qrCodes}
          <script>
            ${items.map(item => {
              const qrData = JSON.stringify({
                id: item.id,
                type: type,
                code: item.itemCode || item.chemicalCode,
                name: item.itemName || item.chemicalName,
                timestamp: new Date().toISOString()
              });
              return `QRCode.toCanvas(document.getElementById('qr-${item.id}'), '${qrData.replace(/'/g, "\\'")}', { width: 150 });`;
            }).join('\n')}
            setTimeout(() => window.print(), 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-gray-900">Batch QR Generation</h3>
        <span className="text-sm text-gray-600">{items.length} items</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Generate and print QR codes for all selected items at once.
      </p>
      
      <button
        onClick={handlePrintAll}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Printer className="w-4 h-4" />
        Print All {items.length} QR Codes
      </button>
    </div>
  );
}

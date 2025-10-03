import Papa from 'papaparse';
import JSZip from 'jszip';
import type { CSVFileType } from './types';
import { CSV_FILE_HEADERS } from './types';

export class CSVExporter {
  static exportToCSV(data: any[], fileType: CSVFileType, filename?: string): void {
    const headers = CSV_FILE_HEADERS[fileType];
    
    // Convert data to CSV format
    const csvData = data.map(item => {
      const row: any = {};
      headers.forEach(header => {
        row[header] = item[header] || '';
      });
      return row;
    });

    // Generate CSV string
    const csv = Papa.unparse(csvData, {
      columns: headers,
      header: true
    });

    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename || `${fileType}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static exportAllFiles(allData: any): void {
    Object.entries(allData).forEach(([fileType, data]) => {
      if (Array.isArray(data) && data.length > 0) {
        const filename = `${fileType}.csv`;
        this.exportToCSV(data, fileType as CSVFileType, filename);
      }
    });
  }

  static async exportAllAsZip(allData: any, districtName: string = 'example-district'): Promise<void> {
    const zip = new JSZip();
    
    // Add each CSV file to the ZIP
    Object.entries(allData).forEach(([fileType, data]) => {
      if (Array.isArray(data) && data.length > 0) {
        const headers = CSV_FILE_HEADERS[fileType as CSVFileType];
        
        // Convert data to CSV format
        const csvData = (data as any[]).map(item => {
          const row: any = {};
          headers.forEach(header => {
            row[header] = item[header] || '';
          });
          return row;
        });

        // Generate CSV string
        const csv = Papa.unparse(csvData, {
          columns: headers,
          header: true
        });

        // Add to ZIP with simple filename (e.g., "students.csv")
        zip.file(`${fileType}.csv`, csv);
      }
    });

    // Generate and download ZIP file
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(zipBlob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${districtName.toLowerCase().replace(/\s+/g, '-')}-csv-files.zip`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
  }

  static previewCSV(data: any[], fileType: CSVFileType, rows: number = 5): string {
    const headers = CSV_FILE_HEADERS[fileType];
    const previewData = data.slice(0, rows);
    
    const csvData = previewData.map(item => {
      const row: any = {};
      headers.forEach(header => {
        row[header] = item[header] || '';
      });
      return row;
    });

    return Papa.unparse(csvData, {
      columns: headers,
      header: true
    });
  }
}

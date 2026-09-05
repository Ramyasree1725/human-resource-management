/**
 * Data Export Formatters & Document Transformers
 * Converts employee registries, attendance timesheets, and leave records
 * into standardized enterprise file formats:
 * - Excel Spreadsheet XML (SpreadsheetML)
 * - Structured CSV with RFC 4180 compliance
 * - vCard Electronic Business Card format (vCard 3.0)
 * - JSON-LD Schema.org Employee Directory Graph format.
 */

export class DataExportFormats {
  static toRFC4180CSV(headers, rows) {
    const escapeField = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const headerLine = headers.map(h => escapeField(h.label || h.key || h)).join(',');
    const dataLines = rows.map(row => {
      return headers.map(h => {
        const key = h.key || h;
        const val = typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key];
        return escapeField(val);
      }).join(',');
    });

    return [headerLine, ...dataLines].join('\r\n');
  }

  static toSpreadsheetXML(sheetName, headers, rows) {
    const sanitizeXML = (str) => {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Vertical="Center" ss:Horizontal="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CCCCCC"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="CurrencyStyle">
   <NumberFormat ss:Format="₹#,##0"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${sanitizeXML(sheetName)}">
  <Table>`;

    // Header Row
    xml += '\n   <Row ss:StyleID="HeaderStyle">';
    headers.forEach(h => {
      xml += `\n    <Cell><Data ss:Type="String">${sanitizeXML(h.label || h.key || h)}</Data></Cell>`;
    });
    xml += '\n   </Row>';

    // Data Rows
    rows.forEach(row => {
      xml += '\n   <Row>';
      headers.forEach(h => {
        const key = h.key || h;
        const val = row[key];
        const isNum = typeof val === 'number';
        const type = isNum ? 'Number' : 'String';
        const style = h.isCurrency ? ' ss:StyleID="CurrencyStyle"' : '';
        xml += `\n    <Cell${style}><Data ss:Type="${type}">${sanitizeXML(val)}</Data></Cell>`;
      });
      xml += '\n   </Row>';
    });

    xml += `\n  </Table>
 </Worksheet>
</Workbook>`;

    return xml;
  }

  static toVCard3(employee) {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${employee.lastName || ''};${employee.firstName || ''};;;`,
      `FN:${employee.firstName || ''} ${employee.lastName || ''}`,
      `ORG:TechNova Solutions Pvt Ltd;${employee.department || 'Operations'}`,
      `TITLE:${employee.designation || 'Specialist'}`,
      `EMAIL;TYPE=INTERNET,WORK:${employee.email || ''}`,
      `TEL;TYPE=WORK,VOICE:${employee.phone || ''}`,
      `ADR;TYPE=WORK:;;100 Innovation Boulevard;Bangalore;Karnataka;560001;India`,
      `NOTE:Employee ID: ${employee.employeeId || ''}`,
      'END:VCARD'
    ];
    return lines.join('\r\n');
  }

  static toBatchVCard(employees = []) {
    return employees.map(emp => DataExportFormats.toVCard3(emp)).join('\r\n\r\n');
  }

  static toSchemaOrgJsonLd(employees = []) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'TechNova Solutions Pvt Ltd',
      'url': 'https://technova.internal',
      'employee': employees.map(emp => ({
        '@type': 'Person',
        'identifier': emp.employeeId,
        'givenName': emp.firstName,
        'familyName': emp.lastName,
        'jobTitle': emp.designation,
        'email': emp.email,
        'telephone': emp.phone,
        'worksFor': {
          '@type': 'Organization',
          'name': 'TechNova Solutions'
        },
        'workLocation': {
          '@type': 'Place',
          'name': emp.location || 'Bangalore Office'
        }
      }))
    };
  }

  static triggerBrowserDownload(content, filename, mimeType = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

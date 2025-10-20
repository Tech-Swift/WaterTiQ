const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { ConsumptionSummary } = require('../models/ConsumptionSummary');
const mongoose = require('mongoose');

// Utility for querying summaries
const buildFilter = (query) => {
  const { period, propertyId, unitId, tenantId } = query;
  const filter = {};
  if (period) filter.period = period;
  if (propertyId) filter.propertyId = new mongoose.Types.ObjectId(propertyId);
  if (unitId) filter.unitId = new mongoose.Types.ObjectId(unitId);
  if (tenantId) filter.tenantId = new mongoose.Types.ObjectId(tenantId);
  return filter;
};

/**
 * Generate PDF Report
 */
const generatePdfReport = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const summaries = await ConsumptionSummary.find(filter)
      .populate('propertyId', 'name location')
      .populate('unitId', 'unitNumber')
      .populate('tenantId', 'name email');

    if (summaries.length === 0) {
      return res.status(404).json({ message: 'No summaries found for given filters' });
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    // Stream PDF to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Water_Usage_Report.pdf"');
    doc.pipe(res);

    // Header
    doc.fontSize(18).text('WATER USAGE REPORT', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Period: ${summaries[0].period}`, { align: 'center' });
    doc.moveDown(1);

    summaries.forEach((s, i) => {
      doc.fontSize(12).text(`${i + 1}. Property: ${s.propertyId?.name || '-'} (${s.propertyId?.location || '-'})`);
      doc.text(`   Unit: ${s.unitId?.unitNumber || '-'}`);
      doc.text(`   Tenant: ${s.tenantId?.name || 'N/A'} (${s.tenantId?.email || '-'})`);
      doc.text(`   Total Consumption: ${s.totalConsumption} L`);
      doc.text(`   Total Cost: KES ${s.totalCost || 0}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Generate Excel Report
 */
const generateExcelReport = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const summaries = await ConsumptionSummary.find(filter)
      .populate('propertyId', 'name location')
      .populate('unitId', 'unitNumber')
      .populate('tenantId', 'name email');

    if (summaries.length === 0) {
      return res.status(404).json({ message: 'No summaries found for given filters' });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Water Usage Report');

    // Header row
    sheet.columns = [
      { header: 'Property', key: 'property', width: 25 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Unit', key: 'unit', width: 15 },
      { header: 'Tenant', key: 'tenant', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Total Consumption (L)', key: 'consumption', width: 20 },
      { header: 'Total Cost (KES)', key: 'cost', width: 20 },
      { header: 'Period', key: 'period', width: 12 },
    ];

    // Fill data
    summaries.forEach((s) => {
      sheet.addRow({
        property: s.propertyId?.name || '-',
        location: s.propertyId?.location || '-',
        unit: s.unitId?.unitNumber || '-',
        tenant: s.tenantId?.name || 'N/A',
        email: s.tenantId?.email || '-',
        consumption: s.totalConsumption,
        cost: s.totalCost,
        period: s.period,
      });
    });

    // Format headers
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Stream Excel file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Water_Usage_Report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generatePdfReport,
  generateExcelReport,
};

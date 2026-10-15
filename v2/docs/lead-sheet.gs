/**
 * Mekong Intelligence: lead sheet receiver (Google Apps Script).
 * Setup steps: see lead-sheet-setup.md in this folder.
 *
 * Receives a lead from the website's /api/book function and appends it as a row to the "Leads" tab.
 * Every cell is written as plain text, so nothing a visitor types can run as a spreadsheet formula.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('LEAD_SECRET');
    if (!secret || body.secret !== secret) {
      return reply_({ ok: false, error: 'unauthorized' });
    }
    if (!Array.isArray(body.row) || !Array.isArray(body.columns)) {
      return reply_({ ok: false, error: 'bad request' });
    }

    lock.waitLock(10000);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName('Leads') || spreadsheet.insertSheet('Leads');

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, body.columns.length).setValues([body.columns]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var values = body.row.map(function (cell) { return String(cell == null ? '' : cell); });
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, values.length);
    range.setNumberFormat('@'); // plain text: no formulas, no date or number conversion
    range.setValues([values]);

    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function reply_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

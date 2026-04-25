// ============================================================
// Google Apps Script — Financial Persona Sorting (vFinal_1)
//
// Paste this into a Google Apps Script project linked to your
// Google Sheet. Handles two actions:
//   1. 'uploadPhoto' — saves photo to Drive immediately
//   2. default — saves quiz results + photo URL to Sheet
//
// SETUP:
// 1. Create/open your Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Delete any existing code and paste this entire script
// 4. Click Deploy > New Deployment (or Manage Deployments)
// 5. Select "Web app", Execute as = Me, Access = Anyone
// 6. Deploy and copy the Web App URL into config.ts
// ============================================================

var FOLDER_IDS = {
    raw: '1Td1TOQPbRTploDSMC-B1ntgIA7r3ihLf',
    avatar: '1TAlumZyy6WIohR3D13Fp6Tz8W0e8mVBV',
    result: '15x-xkHf5F_fyE6XcJggcv1Hm8nbi6eXU'
};

/**
 * Run this function manually in the editor to trigger the 
 * Google Drive permission authorization popup.
 */
function runPermissionCheck() {
    // Check access to all folders
    for (var key in FOLDER_IDS) {
        var folder = DriveApp.getFolderById(FOLDER_IDS[key]);
        var testFile = folder.createFile('permission_test_' + key + '.txt', 'Checking write access...');
        testFile.setTrashed(true);
        Logger.log('Verified ' + key + ' folder: ' + folder.getName());
    }
}

function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);
        var action = data.action || 'submit';

        // ── ACTION: Upload photo (Raw, Avatar, or Result) ──
        if (action === 'uploadPhoto') {
            return handlePhotoUpload(data, FOLDER_IDS[data.type || 'raw']);
        }

        // ── ACTION: Finalize selected card for print queue ──
        if (action === 'finalizeCard') {
            return handleFinalizeCard(data);
        }

        // ── ACTION: Submit quiz results to Sheet ──
        return handleQuizSubmit(data);

    } catch (error) {
        Logger.log('doPost error: ' + error.toString());
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function handleFinalizeCard(data) {
    var sheetName = 'Print Queue';
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var queueSheet = spreadsheet.getSheetByName(sheetName);

    if (!queueSheet) {
        queueSheet = spreadsheet.insertSheet(sheetName);
    }

    if (queueSheet.getLastRow() === 0) {
        queueSheet.appendRow([
            'Timestamp',
            'Name',
            'Theme',
            'House',
            'Trait',
            'Selected Version',
            'Final Card URL',
            'Status'
        ]);
    }

    queueSheet.appendRow([
        new Date().toISOString(),
        data.userName || '',
        data.theme || '',
        data.house || '',
        data.trait || '',
        (data.cardVersion || '').toUpperCase(),
        data.cardUrl || '',
        'READY_TO_PRINT'
    ]);

    return ContentService
        .createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
}

function handlePhotoUpload(data, folderId) {
    var photoUrl = 'Upload Failed';
    var folderIdToUse = folderId || FOLDER_IDS.raw;

    try {
        var folder = DriveApp.getFolderById(folderIdToUse);

        // Decode base64 to blob
        var decodedBytes = Utilities.base64Decode(data.photoBase64);
        var blob = Utilities.newBlob(decodedBytes, 'image/jpeg');

        // Generate filename: Name_YYYYMMDD_HHmmss.jpg
        var now = new Date();
        var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
        var safeName = (data.userName || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
        var variant = (data.variant || '').toString().trim();
        var variantSuffix = variant ? '_' + variant.toUpperCase() : '';
        var fileName = safeName + variantSuffix + '_' + timestamp + '.jpg';

        blob.setName(fileName);

        // Save to Drive folder
        var file = folder.createFile(blob);

        // Make it accessible to anyone with the link
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // Direct view URL
        photoUrl = 'https://drive.google.com/file/d/' + file.getId() + '/view';

    } catch (driveError) {
        photoUrl = 'Upload Error: ' + driveError.toString();
        Logger.log('Drive upload error: ' + driveError.toString());
    }

    return ContentService
        .createTextOutput(JSON.stringify({
            status: 'success',
            photoUrl: photoUrl,
            fileName: fileName || ''
        }))
        .setMimeType(ContentService.MimeType.JSON);
}

function handleQuizSubmit(data) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
        sheet.appendRow([
            'Timestamp',
            'Name',
            'Theme',
            'House',
            'Financial Trait',
            'Description',
            'Q1 Answer',
            'Q2 Answer',
            'Q3 Answer',
            'Q4 Answer',
            'Q5 Answer',
            'Photo URL'
        ]);
    }

    // Append the data row
    sheet.appendRow([
        new Date().toISOString(),
        data.userName || '',
        data.theme || '',
        data.house || '',
        data.trait || '',
        data.description || '',
        data.answers ? data.answers[0] || '' : '',
        data.answers ? data.answers[1] || '' : '',
        data.answers ? data.answers[2] || '' : '',
        data.answers ? data.answers[3] || '' : '',
        data.answers ? data.answers[4] || '' : '',
        data.photoUrl || 'No Photo'
    ]);

    return ContentService
        .createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
}

// Required to handle CORS preflight requests
function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', message: 'FPS vFinal_1 API is live.' }))
        .setMimeType(ContentService.MimeType.JSON);
}

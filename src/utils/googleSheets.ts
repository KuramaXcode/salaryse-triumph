// Google Sheets + Drive Integration
import { SHEET_WEBHOOK_URL } from '../config';
const SHEET_PROXY_URL = '/api/sheet-proxy';

/**
 * Strip the data URL prefix from a base64 image string.
 * e.g. "data:image/jpeg;base64,/9j/4AAQ..." → "/9j/4AAQ..."
 */
function stripBase64Prefix(dataUrl: string): string {
    const idx = dataUrl.indexOf(',');
    return idx >= 0 ? dataUrl.substring(idx + 1) : dataUrl;
}

/**
 * Fetch an image URL and convert to base64.
 */
async function fetchAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function postToSheet(payload: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    try {
        const proxyResponse = await fetch(SHEET_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const proxyJson = await proxyResponse.json().catch(() => null);
        if (proxyJson && typeof proxyJson === 'object') {
            return proxyJson as Record<string, unknown>;
        }
    } catch {
        // Fallback to direct webhook below.
    }

    if (!SHEET_WEBHOOK_URL) return null;

    const directResponse = await fetch(SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
    });

    return await directResponse.json().catch(() => null);
}

// ── Upload photo to Drive immediately after capture ──

export interface PhotoUploadResult {
    success: boolean;
    photoUrl: string | null;
    error: string | null;
}

export const uploadPhotoToDrive = async (
    userName: string,
    photoData: string, // Can be base64 data URL or external URL
    type: 'raw' | 'avatar' | 'result' = 'raw',
    variant?: 'v1' | 'v2'
): Promise<PhotoUploadResult> => {
    try {
        let base64ToUpload = photoData;

        // If it's a URL (not a data URL), fetch it first
        if (photoData.startsWith('http')) {
            try {
                base64ToUpload = await fetchAsBase64(photoData);
            } catch (err) {
                console.error('Failed to fetch image for Drive upload:', err);
                // Continue anyway, maybe the script can handle it? (unlikely, but safer than crashing)
            }
        }

        const result = await postToSheet({
            action: 'uploadPhoto',
            type: type,
            userName: userName,
            variant: variant || '',
            photoBase64: stripBase64Prefix(base64ToUpload),
        });

        if (result) {
            return {
                success: result.status === 'success',
                photoUrl: typeof result.photoUrl === 'string' ? result.photoUrl : null,
                error: result.status !== 'success' ? String(result.message || 'Upload failed') : null,
            };
        }

        console.log('Photo upload sent (response not readable)');
        return { success: true, photoUrl: null, error: null };
    } catch (error) {
        console.error('Failed to upload photo to Drive:', error);
        return { success: false, photoUrl: null, error: String(error) };
    }
};

// ── Submit quiz results to Sheet ──

export interface SheetData {
    userName: string;
    theme: string;
    house: string;
    trait: string;
    description: string;
    answers: string[];
    photoUrl: string | null; // Drive URL from earlier upload
    photoTaken: boolean;
}

export const submitToGoogleSheet = async (data: SheetData): Promise<boolean> => {
    try {
        await postToSheet({
            action: 'submit',
            userName: data.userName,
            theme: data.theme,
            house: data.house,
            trait: data.trait,
            description: data.description,
            answers: data.answers,
            photoUrl: data.photoUrl,
        });

        console.log('Data submitted to Google Sheet successfully.');
        return true;
    } catch (error) {
        console.error('Failed to submit data to Google Sheet:', error);
        return false;
    }
};

export interface FinalizeCardData {
    userName: string;
    theme: string;
    house: string;
    trait: string;
    cardVersion: 'v1' | 'v2';
    cardUrl: string;
}

export const submitFinalCardToSheet = async (data: FinalizeCardData): Promise<{ success: boolean; error?: string }> => {
    try {
        const result = await postToSheet({
            action: 'finalizeCard',
            userName: data.userName,
            theme: data.theme,
            house: data.house,
            trait: data.trait,
            cardVersion: data.cardVersion,
            cardUrl: data.cardUrl,
        });

        if (result && result.status === 'success') {
            return { success: true };
        }
        if (result && result.status !== 'success') {
            return { success: false, error: String(result.message || 'Finalize request failed') };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
};

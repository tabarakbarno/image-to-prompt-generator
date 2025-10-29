import { PromptResult } from "../App";

/**
 * Creates a data URL and triggers a download.
 * @param data The string data to be downloaded.
 * @param filename The name of the file to be saved.
 * @param type The MIME type of the file.
 */
const downloadFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Exports an array of prompt results to a formatted TXT file.
 * @param results An array of PromptResult objects.
 */
export const exportToTXT = (results: PromptResult[]) => {
    let content = `Image Prompt Studio Export\nGenerated on: ${new Date().toLocaleString()}\n\n`;
    content += "========================================\n\n";

    results.forEach((result, index) => {
        content += `--- Prompt ${index + 1} ---\n`;
        content += `Style: ${result.style}\n`;
        content += `Tone: ${result.tone}\n`;
        content += `Language: ${result.language}\n\n`;
        content += `${result.prompt}\n\n`;
        content += "========================================\n\n";
    });

    downloadFile(content, `prompts_${Date.now()}.txt`, 'text/plain;charset=utf-8;');
};


/**
 * Exports an array of prompt results to a JSON file.
 * @param results An array of PromptResult objects.
 */
export const exportToJSON = (results: PromptResult[]) => {
    const dataToExport = {
        exportedAt: new Date().toISOString(),
        promptCount: results.length,
        prompts: results.map(({ id, imagePreviewUrl, ...rest }) => rest) // Exclude internal IDs and image data
    };
    
    const content = JSON.stringify(dataToExport, null, 2);
    downloadFile(content, `prompts_${Date.now()}.json`, 'application/json;charset=utf-8;');
};
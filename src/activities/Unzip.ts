import type { IActivityHandler } from "@vertigis/workflow";

interface UnzipInputs {
    /**
     * @description The zip file to unzip.
     * @required
     */
    file: Blob | ArrayBuffer;

    /**
     * @description An optional filter to apply to include only a subset of the zip file entries.
     */
    filter?: (path: string) => boolean;
}

interface UnzipOutputs {
    /**
     * @description The unzipped archive.
     */
    result: { [path: string]: Blob };
}

/**
 * @displayName Unzip
 * @category Zip
 * @description Unzips a zip archive into a collection of files.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class Unzip implements IActivityHandler {
    async execute(inputs: UnzipInputs): Promise<UnzipOutputs> {
        const { file, filter = () => true } = inputs;
        if (!file) {
            throw new Error("file is required");
        }

        const JSZip = await import("jszip").then((x) => x.default);
        const zip = await JSZip.loadAsync(file);

        const result: UnzipOutputs["result"] = {};
        for (const path in zip.files) {
            if (!filter(path)) {
                continue;
            }
            const entry = zip.files[path];
            if (entry.dir) {
                // Ignore directories
                continue;
            }
            result[path] = await entry.async("blob");
        }

        return {
            result,
        };
    }
}

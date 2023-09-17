import type { IActivityHandler } from "@vertigis/workflow";

interface ZipInputs {
    /**
     * @description The files to include in the zip archive.
     * @required
     */
    files: { [path: string]: string | Blob | ArrayBuffer };
}

interface ZipOutputs {
    /**
     * @description The resulting zip archive.
     */
    result: Blob;
}

/**
 * @displayName Zip
 * @category Zip
 * @description Creates a zip archive from a collection of files.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class Zip implements IActivityHandler {
    async execute(inputs: ZipInputs): Promise<ZipOutputs> {
        const { files } = inputs;
        if (!files) {
            throw new Error("files is required");
        }

        const JSZip = await import("jszip").then((x) => x.default);
        const zip = new JSZip();

        for (const path in files) {
            const content = files[path];
            zip.file(path, content);
        }

        const result = await zip.generateAsync({ type: "blob" });
        return {
            result,
        };
    }
}

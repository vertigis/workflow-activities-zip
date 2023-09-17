import Unzip from "../Unzip";
import fs from "fs/promises";
import path from "path";

describe("Zip", () => {
    it("unzips the file", async () => {
        const zipPath = path.resolve(__dirname, "./sample.zip");
        const buffer = await fs.readFile(zipPath);
        const activity = new Unzip();
        const result = await activity.execute({ file: buffer });
        expect(result.result).toBeDefined();
        expect(Object.keys(result.result).length).toBe(3);
        expect(result.result["file1.txt"]).toBeDefined();
        expect(result.result["folder/file2.txt"]).toBeDefined();
        expect(result.result["image.png"]).toBeDefined();
    });
    it("unzips the file and applies the filter", async () => {
        const zipPath = path.resolve(__dirname, "./sample.zip");
        const buffer = await fs.readFile(zipPath);
        const activity = new Unzip();
        const result = await activity.execute({
            file: buffer,
            filter: (path) => path.endsWith(".txt"),
        });
        expect(result.result).toBeDefined();
        expect(Object.keys(result.result).length).toBe(2);
    });
    it("throws if files input missing", async () => {
        const activity = new Unzip();
        await expect(
            activity.execute({ file: undefined as any }),
        ).rejects.toThrow("file is required");
    });
});

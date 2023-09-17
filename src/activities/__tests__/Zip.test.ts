import Zip from "../Zip";

describe("Zip", () => {
    it("zips the files", async () => {
        const files = {
            "file1.txt": "foo",
            "folder/file2.txt": new Blob(["bar"]),
        };
        const activity = new Zip();
        const result = await activity.execute({ files });
        expect(result.result).toBeDefined();
        expect(result.result.size).toBeGreaterThan(0);
    });
    it("throws if files input missing", async () => {
        const activity = new Zip();
        await expect(
            activity.execute({ files: undefined as any }),
        ).rejects.toThrow("files is required");
    });
});

/**
 * Media Upload API Test Script
 * Tests: single upload, multiple upload, validation, permissions
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    data?: any;
}
declare const results: TestResult[];
declare function runMediaUploadTests(): Promise<{
    passed: number;
    total: number;
    failed: number;
    results: TestResult[];
}>;
export { runMediaUploadTests, results };
//# sourceMappingURL=test-media-upload.d.ts.map
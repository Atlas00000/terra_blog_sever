/**
 * Media Management API Test Script
 * Tests: list, get, delete, permissions
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    data?: any;
}
declare const results: TestResult[];
declare function runMediaManagementTests(): Promise<{
    passed: number;
    total: number;
    failed: number;
    results: TestResult[];
}>;
export { runMediaManagementTests, results };
//# sourceMappingURL=test-media-management.d.ts.map
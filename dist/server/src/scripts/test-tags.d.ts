/**
 * Tags API Test Script
 * Tests: CRUD operations, permissions, validation
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    data?: any;
}
declare const results: TestResult[];
declare function runTagTests(): Promise<{
    passed: number;
    total: number;
    failed: number;
    results: TestResult[];
}>;
export { runTagTests, results };
//# sourceMappingURL=test-tags.d.ts.map
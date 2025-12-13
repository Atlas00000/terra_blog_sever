/**
 * Posts API Test Script
 * Tests: CRUD operations, filtering, search, permissions
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    data?: any;
}
declare const results: TestResult[];
declare function runPostTests(): Promise<{
    passed: number;
    total: number;
    failed: number;
    results: TestResult[];
}>;
export { runPostTests, results };
//# sourceMappingURL=test-posts.d.ts.map
/**
 * Categories API Test Script
 * Tests: CRUD operations, permissions, validation
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    data?: any;
}
declare const results: TestResult[];
declare function runCategoryTests(): Promise<{
    passed: number;
    total: number;
    failed: number;
    results: TestResult[];
}>;
export { runCategoryTests, results };
//# sourceMappingURL=test-categories.d.ts.map
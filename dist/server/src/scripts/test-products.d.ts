/**
 * Products API Test Script
 * Tests: CRUD operations, permissions, validation
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    data?: any;
}
declare const results: TestResult[];
declare function runProductTests(): Promise<{
    passed: number;
    total: number;
    failed: number;
    results: TestResult[];
}>;
export { runProductTests, results };
//# sourceMappingURL=test-products.d.ts.map
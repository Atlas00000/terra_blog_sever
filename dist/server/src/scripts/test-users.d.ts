/**
 * User Management API Test Script
 * Tests: CRUD operations, permissions, pagination
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    data?: any;
}
declare const results: TestResult[];
declare function runUserTests(): Promise<{
    passed: number;
    total: number;
    failed: number;
    results: TestResult[];
}>;
export { runUserTests, results };
//# sourceMappingURL=test-users.d.ts.map
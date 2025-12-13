/**
 * Authentication API Test Script
 * Tests: register, login, invalid credentials, token validation
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    data?: any;
}
declare const results: TestResult[];
declare function runAuthTests(): Promise<{
    passed: number;
    total: number;
    failed: number;
    results: TestResult[];
}>;
export { runAuthTests, results };
//# sourceMappingURL=test-auth.d.ts.map
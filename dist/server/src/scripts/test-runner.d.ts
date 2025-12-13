/**
 * Comprehensive Test Runner for Week 2
 * Runs all test suites and generates a summary report
 */
interface TestSuiteResult {
    suite: string;
    passed: number;
    total: number;
    failed: number;
    successRate: number;
}
declare function runAllTests(): Promise<{
    results: TestSuiteResult[];
    totalPassed: number;
    totalTests: number;
    totalFailed: number;
    overallSuccessRate: number;
    exitCode: number;
}>;
export { runAllTests };
//# sourceMappingURL=test-runner.d.ts.map
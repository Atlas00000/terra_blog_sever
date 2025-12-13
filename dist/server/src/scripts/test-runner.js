"use strict";
/**
 * Comprehensive Test Runner for Week 2
 * Runs all test suites and generates a summary report
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllTests = runAllTests;
const test_auth_1 = require("./test-auth");
const test_users_1 = require("./test-users");
const test_posts_1 = require("./test-posts");
async function runAllTests() {
    console.log('🚀 Starting Comprehensive Week 2 Test Suite\n');
    console.log('='.repeat(60));
    console.log('TERRA INDUSTRIES BLOG - WEEK 2 API TESTS');
    console.log('='.repeat(60));
    console.log(`API Base: ${process.env.API_BASE || 'http://localhost:3001/api/v1'}\n`);
    const results = [];
    // Run Authentication Tests
    console.log('\n' + '='.repeat(60));
    console.log('1️⃣  AUTHENTICATION TESTS');
    console.log('='.repeat(60));
    try {
        const authResult = await (0, test_auth_1.runAuthTests)();
        results.push({
            suite: 'Authentication',
            passed: authResult.passed,
            total: authResult.total,
            failed: authResult.failed,
            successRate: (authResult.passed / authResult.total) * 100,
        });
    }
    catch (error) {
        console.error('❌ Authentication tests failed:', error.message);
        results.push({
            suite: 'Authentication',
            passed: 0,
            total: 0,
            failed: 0,
            successRate: 0,
        });
    }
    // Run User Management Tests
    console.log('\n' + '='.repeat(60));
    console.log('2️⃣  USER MANAGEMENT TESTS');
    console.log('='.repeat(60));
    try {
        const userResult = await (0, test_users_1.runUserTests)();
        results.push({
            suite: 'User Management',
            passed: userResult.passed,
            total: userResult.total,
            failed: userResult.failed,
            successRate: (userResult.passed / userResult.total) * 100,
        });
    }
    catch (error) {
        console.error('❌ User management tests failed:', error.message);
        results.push({
            suite: 'User Management',
            passed: 0,
            total: 0,
            failed: 0,
            successRate: 0,
        });
    }
    // Run Posts Tests
    console.log('\n' + '='.repeat(60));
    console.log('3️⃣  POSTS TESTS');
    console.log('='.repeat(60));
    try {
        const postResult = await (0, test_posts_1.runPostTests)();
        results.push({
            suite: 'Posts',
            passed: postResult.passed,
            total: postResult.total,
            failed: postResult.failed,
            successRate: (postResult.passed / postResult.total) * 100,
        });
    }
    catch (error) {
        console.error('❌ Posts tests failed:', error.message);
        results.push({
            suite: 'Posts',
            passed: 0,
            total: 0,
            failed: 0,
            successRate: 0,
        });
    }
    // Final Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL TEST SUMMARY');
    console.log('='.repeat(60));
    let totalPassed = 0;
    let totalTests = 0;
    let totalFailed = 0;
    results.forEach((result) => {
        totalPassed += result.passed;
        totalTests += result.total;
        totalFailed += result.failed;
        const statusIcon = result.successRate === 100 ? '✅' : result.successRate >= 80 ? '⚠️' : '❌';
        console.log(`${statusIcon} ${result.suite.padEnd(20)} | ` +
            `Passed: ${result.passed.toString().padStart(3)} | ` +
            `Failed: ${result.failed.toString().padStart(3)} | ` +
            `Total: ${result.total.toString().padStart(3)} | ` +
            `Success: ${result.successRate.toFixed(1)}%`);
    });
    console.log('-'.repeat(60));
    const overallSuccessRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
    const overallIcon = overallSuccessRate === 100 ? '✅' : overallSuccessRate >= 80 ? '⚠️' : '❌';
    console.log(`${overallIcon} OVERALL            | ` +
        `Passed: ${totalPassed.toString().padStart(3)} | ` +
        `Failed: ${totalFailed.toString().padStart(3)} | ` +
        `Total: ${totalTests.toString().padStart(3)} | ` +
        `Success: ${overallSuccessRate.toFixed(1)}%`);
    console.log('='.repeat(60));
    // Exit with appropriate code
    const exitCode = totalFailed > 0 ? 1 : 0;
    if (exitCode === 0) {
        console.log('\n🎉 All tests passed!');
    }
    else {
        console.log(`\n⚠️  ${totalFailed} test(s) failed.`);
    }
    return {
        results,
        totalPassed,
        totalTests,
        totalFailed,
        overallSuccessRate,
        exitCode,
    };
}
// Run tests if executed directly
if (require.main === module) {
    runAllTests()
        .then((summary) => {
        process.exit(summary.exitCode);
    })
        .catch((error) => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=test-runner.js.map
"use strict";
/**
 * Comprehensive Test Runner for Week 4
 * Runs all test suites and generates a summary report
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllTests = runAllTests;
const test_media_upload_1 = require("./test-media-upload");
const test_media_management_1 = require("./test-media-management");
async function runAllTests() {
    console.log('🚀 Starting Comprehensive Week 4 Test Suite\n');
    console.log('='.repeat(60));
    console.log('TERRA INDUSTRIES BLOG - WEEK 4 API TESTS');
    console.log('='.repeat(60));
    console.log(`API Base: ${process.env.API_BASE || 'http://localhost:3001/api/v1'}\n`);
    const results = [];
    // Run Media Upload Tests
    console.log('\n' + '='.repeat(60));
    console.log('1️⃣  MEDIA UPLOAD TESTS');
    console.log('='.repeat(60));
    try {
        const uploadResult = await (0, test_media_upload_1.runMediaUploadTests)();
        results.push({
            suite: 'Media Upload',
            passed: uploadResult.passed,
            total: uploadResult.total,
            failed: uploadResult.failed,
            successRate: (uploadResult.passed / uploadResult.total) * 100,
        });
    }
    catch (error) {
        console.error('❌ Media upload tests failed:', error.message);
        results.push({
            suite: 'Media Upload',
            passed: 0,
            total: 0,
            failed: 0,
            successRate: 0,
        });
    }
    // Run Media Management Tests
    console.log('\n' + '='.repeat(60));
    console.log('2️⃣  MEDIA MANAGEMENT TESTS');
    console.log('='.repeat(60));
    try {
        const managementResult = await (0, test_media_management_1.runMediaManagementTests)();
        results.push({
            suite: 'Media Management',
            passed: managementResult.passed,
            total: managementResult.total,
            failed: managementResult.failed,
            successRate: (managementResult.passed / managementResult.total) * 100,
        });
    }
    catch (error) {
        console.error('❌ Media management tests failed:', error.message);
        results.push({
            suite: 'Media Management',
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
//# sourceMappingURL=test-week4-runner.js.map
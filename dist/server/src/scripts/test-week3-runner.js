"use strict";
/**
 * Comprehensive Test Runner for Week 3
 * Runs all test suites and generates a summary report
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllTests = runAllTests;
const test_categories_1 = require("./test-categories");
const test_tags_1 = require("./test-tags");
const test_products_1 = require("./test-products");
async function runAllTests() {
    console.log('🚀 Starting Comprehensive Week 3 Test Suite\n');
    console.log('='.repeat(60));
    console.log('TERRA INDUSTRIES BLOG - WEEK 3 API TESTS');
    console.log('='.repeat(60));
    console.log(`API Base: ${process.env.API_BASE || 'http://localhost:3001/api/v1'}\n`);
    const results = [];
    // Run Categories Tests
    console.log('\n' + '='.repeat(60));
    console.log('1️⃣  CATEGORIES TESTS');
    console.log('='.repeat(60));
    try {
        const categoryResult = await (0, test_categories_1.runCategoryTests)();
        results.push({
            suite: 'Categories',
            passed: categoryResult.passed,
            total: categoryResult.total,
            failed: categoryResult.failed,
            successRate: (categoryResult.passed / categoryResult.total) * 100,
        });
    }
    catch (error) {
        console.error('❌ Categories tests failed:', error.message);
        results.push({
            suite: 'Categories',
            passed: 0,
            total: 0,
            failed: 0,
            successRate: 0,
        });
    }
    // Run Tags Tests
    console.log('\n' + '='.repeat(60));
    console.log('2️⃣  TAGS TESTS');
    console.log('='.repeat(60));
    try {
        const tagResult = await (0, test_tags_1.runTagTests)();
        results.push({
            suite: 'Tags',
            passed: tagResult.passed,
            total: tagResult.total,
            failed: tagResult.failed,
            successRate: (tagResult.passed / tagResult.total) * 100,
        });
    }
    catch (error) {
        console.error('❌ Tags tests failed:', error.message);
        results.push({
            suite: 'Tags',
            passed: 0,
            total: 0,
            failed: 0,
            successRate: 0,
        });
    }
    // Run Products Tests
    console.log('\n' + '='.repeat(60));
    console.log('3️⃣  PRODUCTS TESTS');
    console.log('='.repeat(60));
    try {
        const productResult = await (0, test_products_1.runProductTests)();
        results.push({
            suite: 'Products',
            passed: productResult.passed,
            total: productResult.total,
            failed: productResult.failed,
            successRate: (productResult.passed / productResult.total) * 100,
        });
    }
    catch (error) {
        console.error('❌ Products tests failed:', error.message);
        results.push({
            suite: 'Products',
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
//# sourceMappingURL=test-week3-runner.js.map
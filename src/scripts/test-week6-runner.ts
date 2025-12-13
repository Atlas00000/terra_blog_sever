/**
 * Comprehensive Test Runner for Week 6
 * Runs all test suites and generates a summary report
 */

import { runHealthTests } from './test-health';
import { runCachingTests } from './test-caching';
import { runSoftDeleteTests } from './test-soft-deletes';

interface TestSuiteResult {
  suite: string;
  passed: number;
  total: number;
  failed: number;
  successRate: number;
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Week 6 Test Suite\n');
  console.log('='.repeat(60));
  console.log('TERRA INDUSTRIES BLOG - WEEK 6 API TESTS');
  console.log('='.repeat(60));
  console.log(`API Base: ${process.env.API_BASE || 'http://localhost:3001'}\n`);

  const results: TestSuiteResult[] = [];

  // Run Health Check Tests
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣  HEALTH CHECK TESTS');
  console.log('='.repeat(60));
  try {
    const healthResult = await runHealthTests();
    results.push({
      suite: 'Health Checks',
      passed: healthResult.passed,
      total: healthResult.total,
      failed: healthResult.failed,
      successRate: (healthResult.passed / healthResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Health check tests failed:', error.message);
    results.push({
      suite: 'Health Checks',
      passed: 0,
      total: 0,
      failed: 0,
      successRate: 0,
    });
  }

  // Run Caching Tests
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣  CACHING TESTS');
  console.log('='.repeat(60));
  try {
    const cachingResult = await runCachingTests();
    results.push({
      suite: 'Caching',
      passed: cachingResult.passed,
      total: cachingResult.total,
      failed: cachingResult.failed,
      successRate: (cachingResult.passed / cachingResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Caching tests failed:', error.message);
    results.push({
      suite: 'Caching',
      passed: 0,
      total: 0,
      failed: 0,
      successRate: 0,
    });
  }

  // Run Soft Delete Tests
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣  SOFT DELETE TESTS');
  console.log('='.repeat(60));
  try {
    const softDeleteResult = await runSoftDeleteTests();
    results.push({
      suite: 'Soft Deletes',
      passed: softDeleteResult.passed,
      total: softDeleteResult.total,
      failed: softDeleteResult.failed,
      successRate: (softDeleteResult.passed / softDeleteResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Soft delete tests failed:', error.message);
    results.push({
      suite: 'Soft Deletes',
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
    console.log(
      `${statusIcon} ${result.suite.padEnd(20)} | ` +
      `Passed: ${result.passed.toString().padStart(3)} | ` +
      `Failed: ${result.failed.toString().padStart(3)} | ` +
      `Total: ${result.total.toString().padStart(3)} | ` +
      `Success: ${result.successRate.toFixed(1)}%`
    );
  });

  console.log('-'.repeat(60));
  const overallSuccessRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
  const overallIcon = overallSuccessRate === 100 ? '✅' : overallSuccessRate >= 80 ? '⚠️' : '❌';
  console.log(
    `${overallIcon} OVERALL            | ` +
    `Passed: ${totalPassed.toString().padStart(3)} | ` +
    `Failed: ${totalFailed.toString().padStart(3)} | ` +
    `Total: ${totalTests.toString().padStart(3)} | ` +
    `Success: ${overallSuccessRate.toFixed(1)}%`
  );
  console.log('='.repeat(60));

  // Exit with appropriate code
  const exitCode = totalFailed > 0 ? 1 : 0;
  if (exitCode === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
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

export { runAllTests };


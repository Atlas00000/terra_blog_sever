/**
 * Comprehensive Test Runner for Week 7
 * Runs all test suites and generates a summary report
 */

import { runRateLimitTests } from './test-rate-limiting';
import { runSecurityHeaderTests } from './test-security-headers';
import { runSanitizationTests } from './test-sanitization';

interface TestSuiteResult {
  suite: string;
  passed: number;
  total: number;
  failed: number;
  successRate: number;
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Week 7 Test Suite\n');
  console.log('='.repeat(60));
  console.log('TERRA INDUSTRIES BLOG - WEEK 7 SECURITY TESTS');
  console.log('='.repeat(60));
  console.log(`API Base: ${process.env.API_BASE || 'http://localhost:3001'}\n`);

  const results: TestSuiteResult[] = [];

  // Run Rate Limiting Tests
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣  RATE LIMITING TESTS');
  console.log('='.repeat(60));
  try {
    const rateLimitResult = await runRateLimitTests();
    results.push({
      suite: 'Rate Limiting',
      passed: rateLimitResult.passed,
      total: rateLimitResult.total,
      failed: rateLimitResult.failed,
      successRate: (rateLimitResult.passed / rateLimitResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Rate limiting tests failed:', error.message);
    results.push({
      suite: 'Rate Limiting',
      passed: 0,
      total: 0,
      failed: 0,
      successRate: 0,
    });
  }

  // Run Security Headers Tests
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣  SECURITY HEADERS TESTS');
  console.log('='.repeat(60));
  try {
    const securityHeaderResult = await runSecurityHeaderTests();
    results.push({
      suite: 'Security Headers',
      passed: securityHeaderResult.passed,
      total: securityHeaderResult.total,
      failed: securityHeaderResult.failed,
      successRate: (securityHeaderResult.passed / securityHeaderResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Security headers tests failed:', error.message);
    results.push({
      suite: 'Security Headers',
      passed: 0,
      total: 0,
      failed: 0,
      successRate: 0,
    });
  }

  // Run Sanitization Tests
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣  INPUT SANITIZATION TESTS');
  console.log('='.repeat(60));
  try {
    const sanitizationResult = await runSanitizationTests();
    results.push({
      suite: 'Input Sanitization',
      passed: sanitizationResult.passed,
      total: sanitizationResult.total,
      failed: sanitizationResult.failed,
      successRate: (sanitizationResult.passed / sanitizationResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Sanitization tests failed:', error.message);
    results.push({
      suite: 'Input Sanitization',
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


/**
 * Comprehensive Test Runner for Week 5
 * Runs all test suites and generates a summary report
 */

import { runNewsletterTests } from './test-newsletter';
import { runCommentTests } from './test-comments';
import { runContactTests } from './test-contact';
import { runPressTests } from './test-press';

interface TestSuiteResult {
  suite: string;
  passed: number;
  total: number;
  failed: number;
  successRate: number;
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Week 5 Test Suite\n');
  console.log('='.repeat(60));
  console.log('TERRA INDUSTRIES BLOG - WEEK 5 API TESTS');
  console.log('='.repeat(60));
  console.log(`API Base: ${process.env.API_BASE || 'http://localhost:3001/api/v1'}\n`);

  const results: TestSuiteResult[] = [];

  // Run Newsletter Tests
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣  NEWSLETTER TESTS');
  console.log('='.repeat(60));
  try {
    const newsletterResult = await runNewsletterTests();
    results.push({
      suite: 'Newsletter',
      passed: newsletterResult.passed,
      total: newsletterResult.total,
      failed: newsletterResult.failed,
      successRate: (newsletterResult.passed / newsletterResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Newsletter tests failed:', error.message);
    results.push({
      suite: 'Newsletter',
      passed: 0,
      total: 0,
      failed: 0,
      successRate: 0,
    });
  }

  // Run Comments Tests
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣  COMMENTS TESTS');
  console.log('='.repeat(60));
  try {
    const commentResult = await runCommentTests();
    results.push({
      suite: 'Comments',
      passed: commentResult.passed,
      total: commentResult.total,
      failed: commentResult.failed,
      successRate: (commentResult.passed / commentResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Comments tests failed:', error.message);
    results.push({
      suite: 'Comments',
      passed: 0,
      total: 0,
      failed: 0,
      successRate: 0,
    });
  }

  // Run Contact Tests
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣  CONTACT TESTS');
  console.log('='.repeat(60));
  try {
    const contactResult = await runContactTests();
    results.push({
      suite: 'Contact',
      passed: contactResult.passed,
      total: contactResult.total,
      failed: contactResult.failed,
      successRate: (contactResult.passed / contactResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Contact tests failed:', error.message);
    results.push({
      suite: 'Contact',
      passed: 0,
      total: 0,
      failed: 0,
      successRate: 0,
    });
  }

  // Run Press Releases Tests
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣  PRESS RELEASES TESTS');
  console.log('='.repeat(60));
  try {
    const pressResult = await runPressTests();
    results.push({
      suite: 'Press Releases',
      passed: pressResult.passed,
      total: pressResult.total,
      failed: pressResult.failed,
      successRate: (pressResult.passed / pressResult.total) * 100,
    });
  } catch (error: any) {
    console.error('❌ Press releases tests failed:', error.message);
    results.push({
      suite: 'Press Releases',
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


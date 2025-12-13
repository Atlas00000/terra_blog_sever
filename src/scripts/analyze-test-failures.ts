/**
 * Test Failure Analysis Script
 * Categorizes and analyzes all test failures to identify patterns
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface FailureCategory {
  name: string;
  count: number;
  examples: string[];
  files: Set<string>;
}

interface TestFailure {
  file: string;
  suite: string;
  test: string;
  error: string;
  category: string;
}

class FailureAnalyzer {
  private categories: Map<string, FailureCategory> = new Map();
  private failures: TestFailure[] = [];

  /**
   * Run tests and capture output
   */
  private runTests(): string {
    try {
      console.log('🔍 Running tests to analyze failures...\n');
      const output = execSync('npm test 2>&1', { 
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });
      return output;
    } catch (error: any) {
      // Jest exits with code 1 when tests fail, but we still get output
      return error.stdout || error.message || '';
    }
  }

  /**
   * Categorize a failure based on error message
   */
  private categorizeFailure(error: string): string {
    const lowerError = error.toLowerCase();

    if (lowerError.includes('prismaclientknownrequesterror') || 
        lowerError.includes('prisma') ||
        lowerError.includes('database') ||
        lowerError.includes('connection')) {
      return 'Database/Prisma';
    }

    if (lowerError.includes('unauthorized') || 
        lowerError.includes('forbidden') ||
        lowerError.includes('token') ||
        lowerError.includes('authentication') ||
        lowerError.includes('authorization')) {
      return 'Authentication/Authorization';
    }

    if (lowerError.includes('not found') || 
        lowerError.includes('404')) {
      return 'Not Found (404)';
    }

    if (lowerError.includes('validation') || 
        lowerError.includes('invalid') ||
        lowerError.includes('400')) {
      return 'Validation';
    }

    if (lowerError.includes('typescript') || 
        lowerError.includes('ts') ||
        lowerError.includes('type')) {
      return 'TypeScript Errors';
    }

    if (lowerError.includes('timeout') || 
        lowerError.includes('exceeded')) {
      return 'Timeout';
    }

    if (lowerError.includes('expect') || 
        lowerError.includes('assertion')) {
      return 'Assertion Failure';
    }

    return 'Other';
  }

  /**
   * Parse test output and extract failures
   */
  private parseFailures(output: string): void {
    const lines = output.split('\n');
    let currentFile = '';
    let currentSuite = '';
    let currentTest = '';
    let collectingError = false;
    let errorLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect test file
      if (line.includes('FAIL src/__tests__')) {
        const match = line.match(/FAIL src\/__tests__\/(.+)\.test\.ts/);
        if (match) {
          currentFile = match[1];
        }
      }

      // Detect test suite
      if (line.match(/^\s+[A-Z]/) && !line.includes('●') && !line.includes('✓')) {
        currentSuite = line.trim();
      }

      // Detect failing test
      if (line.includes('●')) {
        const match = line.match(/●\s+(.+)/);
        if (match) {
          currentTest = match[1].trim();
          collectingError = true;
          errorLines = [];
        }
      }

      // Collect error lines
      if (collectingError) {
        if (line.trim() && !line.includes('●') && !line.includes('at ')) {
          errorLines.push(line.trim());
        }

        // End of error block
        if (line.trim() === '' && errorLines.length > 0) {
          const error = errorLines.join(' ');
          const category = this.categorizeFailure(error);

          this.failures.push({
            file: currentFile,
            suite: currentSuite,
            test: currentTest,
            error: error.substring(0, 200), // Truncate long errors
            category,
          });

          // Update category stats
          if (!this.categories.has(category)) {
            this.categories.set(category, {
              name: category,
              count: 0,
              examples: [],
              files: new Set(),
            });
          }

          const cat = this.categories.get(category)!;
          cat.count++;
          cat.files.add(currentFile);
          if (cat.examples.length < 5) {
            cat.examples.push(`${currentTest} (${currentFile})`);
          }

          collectingError = false;
          errorLines = [];
        }
      }
    }
  }

  /**
   * Generate analysis report
   */
  private generateReport(): string {
    const categories = Array.from(this.categories.values())
      .sort((a, b) => b.count - a.count);

    let report = '# Test Failure Analysis Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    report += '## Summary\n\n';
    report += `- Total Failures: ${this.failures.length}\n`;
    report += `- Categories: ${categories.length}\n`;
    report += `- Affected Files: ${new Set(this.failures.map(f => f.file)).size}\n\n`;

    report += '## Failure Categories (by count)\n\n';
    categories.forEach((cat, index) => {
      report += `### ${index + 1}. ${cat.name} (${cat.count} failures)\n\n`;
      report += `**Affected Files:** ${Array.from(cat.files).join(', ')}\n\n`;
      report += `**Examples:**\n`;
      cat.examples.forEach(ex => {
        report += `- ${ex}\n`;
      });
      report += '\n';
    });

    report += '## Detailed Failures by File\n\n';
    const files = new Set(this.failures.map(f => f.file));
    files.forEach(file => {
      const fileFailures = this.failures.filter(f => f.file === file);
      report += `### ${file}\n\n`;
      fileFailures.forEach(failure => {
        report += `- **${failure.test}** (${failure.category})\n`;
        report += `  - Error: ${failure.error.substring(0, 150)}...\n\n`;
      });
    });

    return report;
  }

  /**
   * Main analysis function
   */
  public analyze(): void {
    console.log('🚀 Starting failure analysis...\n');

    // Run tests
    const output = this.runTests();

    // Extract test summary
    const summaryMatch = output.match(/Test Suites: (\d+) failed, (\d+) passed, (\d+) total/);
    const testsMatch = output.match(/Tests:\s+(\d+) failed, (\d+) passed, (\d+) total/);

    if (summaryMatch) {
      console.log('📊 Test Summary:');
      console.log(`   Suites: ${summaryMatch[2]} passed, ${summaryMatch[1]} failed`);
    }

    if (testsMatch) {
      console.log(`   Tests: ${testsMatch[2]} passed, ${testsMatch[1]} failed\n`);
    }

    // Parse failures
    console.log('🔍 Parsing failures...');
    this.parseFailures(output);

    // Generate report
    console.log('📝 Generating report...');
    const report = this.generateReport();

    // Save report
    const reportPath = join(process.cwd(), 'TEST-FAILURE-ANALYSIS.md');
    writeFileSync(reportPath, report);
    console.log(`\n✅ Analysis complete! Report saved to: ${reportPath}\n`);

    // Print summary
    console.log('📈 Failure Categories:');
    const categories = Array.from(this.categories.values())
      .sort((a, b) => b.count - a.count);
    
    categories.forEach((cat, index) => {
      const percentage = ((cat.count / this.failures.length) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${cat.name}: ${cat.count} (${percentage}%)`);
    });

    console.log('\n💡 Recommendation: Start fixing the highest-impact category first.\n');
  }
}

// Run analysis
const analyzer = new FailureAnalyzer();
analyzer.analyze();

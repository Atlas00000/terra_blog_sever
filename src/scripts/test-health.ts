/**
 * Health Check API Test Script
 * Tests: /health, /health/live, /health/ready, /health/detailed
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

async function makeRequest(
  method: string,
  endpoint: string,
  body?: any
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  return { status: response.status, data };
}

function logTest(name: string, passed: boolean, error?: string, data?: any) {
  results.push({ name, passed, error, data });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
}

async function testBasicHealth() {
  console.log('\n🏥 Testing Basic Health Check...');

  // Test 1: Basic health check
  try {
    const { status, data } = await makeRequest('GET', '/health');
    
    if (status === 200 && data.status === 'healthy' && data.timestamp && data.version) {
      logTest('Basic health check returns healthy status', true);
    } else {
      logTest('Basic health check returns healthy status', false, `Status: ${status}, Data: ${JSON.stringify(data)}`);
    }
  } catch (error: any) {
    logTest('Basic health check returns healthy status', false, error.message);
  }

  // Test 2: Health check has required fields
  try {
    const { status, data } = await makeRequest('GET', '/health');
    
    if (status === 200 && data.timestamp && data.version) {
      logTest('Health check includes timestamp and version', true);
    } else {
      logTest('Health check includes timestamp and version', false, `Missing fields`);
    }
  } catch (error: any) {
    logTest('Health check includes timestamp and version', false, error.message);
  }
}

async function testLiveness() {
  console.log('\n💓 Testing Liveness Probe...');

  // Test 1: Liveness probe
  try {
    const { status, data } = await makeRequest('GET', '/health/live');
    
    if (status === 200 && data.status === 'alive' && data.timestamp) {
      logTest('Liveness probe returns alive status', true);
    } else {
      logTest('Liveness probe returns alive status', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Liveness probe returns alive status', false, error.message);
  }

  // Test 2: Liveness probe is fast
  try {
    const start = Date.now();
    const { status } = await makeRequest('GET', '/health/live');
    const duration = Date.now() - start;
    
    if (status === 200 && duration < 1000) {
      logTest('Liveness probe responds quickly', true);
    } else {
      logTest('Liveness probe responds quickly', false, `Duration: ${duration}ms`);
    }
  } catch (error: any) {
    logTest('Liveness probe responds quickly', false, error.message);
  }
}

async function testReadiness() {
  console.log('\n✅ Testing Readiness Probe...');

  // Test 1: Readiness probe
  try {
    const { status, data } = await makeRequest('GET', '/health/ready');
    
    if (status === 200 && data.status === 'ready' && data.checks) {
      logTest('Readiness probe returns ready status', true);
    } else if (status === 503 && data.status === 'not ready') {
      logTest('Readiness probe returns not ready status (expected if services down)', true);
    } else {
      logTest('Readiness probe returns ready status', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Readiness probe returns ready status', false, error.message);
  }

  // Test 2: Readiness probe checks database
  try {
    const { status, data } = await makeRequest('GET', '/health/ready');
    
    if (data.checks && data.checks.database) {
      logTest('Readiness probe checks database', true);
    } else {
      logTest('Readiness probe checks database', false, `Missing database check`);
    }
  } catch (error: any) {
    logTest('Readiness probe checks database', false, error.message);
  }

  // Test 3: Readiness probe checks Redis
  try {
    const { status, data } = await makeRequest('GET', '/health/ready');
    
    if (data.checks && data.checks.redis) {
      logTest('Readiness probe checks Redis', true);
    } else {
      logTest('Readiness probe checks Redis', false, `Missing Redis check`);
    }
  } catch (error: any) {
    logTest('Readiness probe checks Redis', false, error.message);
  }
}

async function testDetailedHealth() {
  console.log('\n📊 Testing Detailed Health Check...');

  // Test 1: Detailed health check
  try {
    const { status, data } = await makeRequest('GET', '/health/detailed');
    
    if (status === 200 && data.checks && (data.system || data.checks.system)) {
      logTest('Detailed health check returns comprehensive data', true);
    } else {
      logTest('Detailed health check returns comprehensive data', false, `Status: ${status}, Data: ${JSON.stringify(data).substring(0, 100)}`);
    }
  } catch (error: any) {
    logTest('Detailed health check returns comprehensive data', false, error.message);
  }

  // Test 2: Detailed health includes database stats
  try {
    const { status, data } = await makeRequest('GET', '/health/detailed');
    
    if (data.checks && data.checks.database && data.checks.database.stats) {
      logTest('Detailed health includes database stats', true);
    } else {
      logTest('Detailed health includes database stats', false, `Missing database stats`);
    }
  } catch (error: any) {
    logTest('Detailed health includes database stats', false, error.message);
  }

  // Test 3: Detailed health includes system info
  try {
    const { status, data } = await makeRequest('GET', '/health/detailed');
    
    const systemInfo = data.system || data.checks?.system;
    if (systemInfo && systemInfo.nodeVersion && systemInfo.memory) {
      logTest('Detailed health includes system information', true);
    } else {
      logTest('Detailed health includes system information', false, `Missing system info: ${JSON.stringify(data).substring(0, 200)}`);
    }
  } catch (error: any) {
    logTest('Detailed health includes system information', false, error.message);
  }

  // Test 4: Detailed health includes latency
  try {
    const { status, data } = await makeRequest('GET', '/health/detailed');
    
    if (data.checks && data.checks.database && data.checks.database.latency) {
      logTest('Detailed health includes latency metrics', true);
    } else {
      logTest('Detailed health includes latency metrics', false, `Missing latency`);
    }
  } catch (error: any) {
    logTest('Detailed health includes latency metrics', false, error.message);
  }
}

async function runHealthTests() {
  console.log('🧪 Starting Health Check API Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testBasicHealth();
  await testLiveness();
  await testReadiness();
  await testDetailedHealth();

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const failed = total - passed;

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));

  return { passed, total, failed, results };
}

// Run tests if executed directly
if (require.main === module) {
  runHealthTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runHealthTests, results };


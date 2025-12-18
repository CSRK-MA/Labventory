import { useState } from 'react';
import { TestCircle, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { runAllDatabaseTests } from '../../services/databaseLimitTest';
import type { TestResults } from '../../services/databaseLimitTest';

export function DatabaseLimitTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResults[]>([]);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      const testResults = await runAllDatabaseTests();
      setResults(testResults);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Database Limitations Test</h1>
        <p className="text-gray-600 mt-2">
          Test Firestore document size, batch limits, concurrent operations, and report performance
        </p>
      </div>

      {/* Test Stats */}
      {results.length > 0 && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Total Tests</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">{results.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 font-medium">Passed</div>
            <div className="text-2xl font-bold text-green-900 mt-1">{passedCount}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-sm text-red-600 font-medium">Failed</div>
            <div className="text-2xl font-bold text-red-900 mt-1">{failedCount}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-600 font-medium">Success Rate</div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              {results.length > 0 ? `${Math.round((passedCount / results.length) * 100)}%` : '0%'}
            </div>
          </div>
        </div>
      )}

      {/* Run Tests Button */}
      <button
        onClick={handleRunTests}
        disabled={isRunning}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isRunning ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Running Tests...
          </>
        ) : (
          <>
            <TestCircle className="w-5 h-5" />
            Run Database Tests
          </>
        )}
      </button>

      {/* Test Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Test Header */}
            <button
              onClick={() => setExpandedTest(expandedTest === result.testName ? null : result.testName)}
              className="w-full p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {result.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{result.testName}</h3>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-medium text-gray-900">
                  {result.metrics.duration.toFixed(2)}ms
                </div>
                {result.metrics.documentCount && (
                  <div className="text-xs text-gray-500">
                    {result.metrics.documentCount} docs
                  </div>
                )}
              </div>
            </button>

            {/* Expanded Details */}
            {expandedTest === result.testName && (
              <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-4">
                {/* Metrics */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 font-medium">Duration</div>
                      <div className="text-lg font-semibold text-gray-900 mt-1">
                        {result.metrics.duration.toFixed(2)}ms
                      </div>
                    </div>
                    {result.metrics.documentCount !== undefined && (
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <div className="text-xs text-gray-500 font-medium">Documents</div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">
                          {result.metrics.documentCount.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {result.metrics.operationsPerSecond !== undefined && (
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <div className="text-xs text-gray-500 font-medium">Ops/Second</div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">
                          {result.metrics.operationsPerSecond}
                        </div>
                      </div>
                    )}
                    {result.metrics.dataSize !== undefined && (
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <div className="text-xs text-gray-500 font-medium">Data Size</div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">
                          {(result.metrics.dataSize / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Limit Information */}
                {result.limit && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 {result.limit.name}</h4>
                    <div className="text-sm text-blue-800 mb-2">
                      <strong>Limit:</strong> {result.limit.value}
                    </div>
                    <div className="text-sm text-blue-700 bg-white rounded p-2">
                      <strong>Recommendation:</strong> {result.limit.recommendation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Information Box */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important Information</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Firestore pricing is based on reads, writes, and deletes. Tests will generate charges.</li>
          <li>• Document size limit: 1 MB per document</li>
          <li>• Batch size limit: 500 documents per batch operation</li>
          <li>• Most queries need composite indexes for complex filters</li>
          <li>• Real-time listeners count as continuous reads</li>
          <li>• Consider query optimization and indexing strategies</li>
        </ul>
      </div>

      {/* Firestore Limits Reference */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Firestore Quotas & Limits Reference</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                category: "Document Size",
                limit: "1 MB maximum",
                recommendation: "Keep average document size < 100 KB"
              },
              {
                category: "Batch Operations",
                limit: "500 documents per batch",
                recommendation: "Split large operations into multiple batches"
              },
              {
                category: "Field Values",
                limit: "String: 1.4 MB | Array: 20K elements",
                recommendation: "Use subcollections for large arrays"
              },
              {
                category: "Subcollections",
                limit: "No limit per collection",
                recommendation: "Use for organizing hierarchical data"
              },
              {
                category: "Query Results",
                limit: "20,000 documents max (per query)",
                recommendation: "Implement pagination for large result sets"
              },
              {
                category: "Composite Indexes",
                limit: "200 limit per database",
                recommendation: "Monitor and clean up unused indexes"
              },
              {
                category: "Real-time Listeners",
                limit: "100 concurrent per app",
                recommendation: "Detach unused listeners to free up capacity"
              },
              {
                category: "Write Rate",
                limit: "1 write per second per document",
                recommendation: "Distribute writes across multiple documents"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900">{item.category}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.limit}</p>
                <p className="text-xs text-amber-700 bg-amber-50 rounded mt-2 p-2">
                  💡 {item.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

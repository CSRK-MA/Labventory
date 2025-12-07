import { useState } from "react";
import { Database, Play, X, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { addEquipment, addChemical } from "../../services/firebaseService";

export function CustomDataEntry() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const exampleQueries = [
    {
      label: "Add Equipment",
      query: `INSERT INTO equipment 
VALUES (
  name: "Microscope",
  category: "Biology",
  quantity: 5,
  status: "Available",
  location: "Lab A"
)`
    },
    {
      label: "Add Chemical",
      query: `INSERT INTO chemicals 
VALUES (
  name: "Hydrochloric Acid",
  formula: "HCl",
  quantity: 2.5,
  unit: "Liters",
  hazardLevel: "High",
  location: "Storage A"
)`
    }
  ];

  const parseCustomQuery = (query: string) => {
    try {
      // Simple parser for INSERT INTO syntax
      const insertMatch = query.match(/INSERT INTO (\w+)\s+VALUES\s*\(([\s\S]+)\)/i);
      
      if (!insertMatch) {
        throw new Error("Invalid query format. Use: INSERT INTO table VALUES (...)");
      }

      const table = insertMatch[1].toLowerCase();
      const valuesStr = insertMatch[2];

      // Parse key-value pairs
      const data: any = {};
      const pairs = valuesStr.split(',');
      
      for (const pair of pairs) {
        const [key, value] = pair.split(':').map(s => s.trim());
        if (key && value) {
          // Remove quotes
          const cleanKey = key.replace(/['"]/g, '');
          let cleanValue: any = value.replace(/['"]/g, '').trim();
          
          // Convert to appropriate type
          if (!isNaN(Number(cleanValue))) {
            cleanValue = Number(cleanValue);
          }
          
          data[cleanKey] = cleanValue;
        }
      }

      return { table, data };
    } catch (error: any) {
      throw new Error(`Parse error: ${error.message}`);
    }
  };

  const handleExecute = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }

    setLoading(true);
    try {
      const { table, data } = parseCustomQuery(query);

      let result;
      if (table === 'equipment') {
        result = await addEquipment(data);
      } else if (table === 'chemicals') {
        result = await addChemical(data);
      } else {
        throw new Error(`Unknown table: ${table}`);
      }

      if (result.success) {
        setResult({
          success: true,
          message: `✅ Successfully added to ${table}`,
          id: result.id,
          data
        });
        toast.success(`Data added to ${table}!`);
      } else {
        throw new Error("Failed to execute query");
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `❌ Error: ${error.message}`
      });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-gray-900">📊 Custom Data Entry</h1>
        <p className="text-gray-600 mt-1">Add data using SQL-like queries</p>
      </div>

      {/* Query Editor */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-400" />
            <span className="text-white font-mono text-sm">Query Editor</span>
          </div>
          <button
            onClick={handleExecute}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {loading ? "Executing..." : "Execute"}
          </button>
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-64 p-6 font-mono text-sm bg-gray-50 border-0 focus:outline-none resize-none"
          placeholder="Enter your query here...

Example:
INSERT INTO equipment 
VALUES (
  name: &quot;Microscope&quot;,
  category: &quot;Biology&quot;,
  quantity: 5,
  status: &quot;Available&quot;,
  location: &quot;Lab A&quot;
)"
        />
      </div>

      {/* Example Queries */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Example Queries</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {exampleQueries.map((example, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{example.label}</h4>
                <button
                  onClick={() => setQuery(example.query)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to editor"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <pre className="text-xs text-gray-600 font-mono overflow-x-auto">
                {example.query}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-xl border p-6 ${
          result.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.success ? 'Success!' : 'Error'}
              </h3>
              <p className={`mb-3 ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>
              {result.data && (
                <div className="bg-white/50 rounded-lg p-4 font-mono text-sm">
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              )}
              {result.id && (
                <p className="text-xs text-gray-600 mt-2">
                  Document ID: {result.id}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Syntax Guide */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Syntax Guide</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">INSERT INTO table</span>
            <span className="ml-2">- Specify table name (equipment or chemicals)</span>
          </div>
          <div>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">VALUES (...)</span>
            <span className="ml-2">- List key-value pairs separated by commas</span>
          </div>
          <div>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">key: "value"</span>
            <span className="ml-2">- Each field as key: value</span>
          </div>
        </div>
      </div>
    </div>
  );
}
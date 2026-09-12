import React, { useState } from 'react';
import { Database, Cpu, Shield, MapPin, Layers, Sparkles, Terminal, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function DatabaseLab() {
  const [activeTab, setActiveTab] = useState('mongo');

  // MongoDB Tab State
  const [mongoSearch, setMongoSearch] = useState('calculator');
  const [mongoResults, setMongoResults] = useState(null);
  const [mongoLoading, setMongoLoading] = useState(false);

  // Neo4j Tab State
  const [graphSubject, setGraphSubject] = useState('SUB_DBMS_501');
  const [graphResults, setGraphResults] = useState(null);
  const [graphLoading, setGraphLoading] = useState(false);

  // Temporal Tab State
  const [temporalResId, setTemporalResId] = useState('RES_CALC_001');
  const [temporalAsOf, setTemporalAsOf] = useState('2026-03-20T14:30:00Z');
  const [temporalResults, setTemporalResults] = useState(null);
  const [temporalLoading, setTemporalLoading] = useState(false);

  // Spatial Tab State
  const [spatialRadius, setSpatialRadius] = useState(1000);
  const [spatialResults, setSpatialResults] = useState(null);
  const [spatialLoading, setSpatialLoading] = useState(false);

  // Active DB ECA Tab State
  const [ecaStatus, setEcaStatus] = useState('available');
  const [ecaResults, setEcaResults] = useState(null);
  const [ecaLoading, setEcaLoading] = useState(false);

  // AI NLU Tab State
  const [aiQuery, setAiQuery] = useState('I need a calculator for DBMS lab near CEG campus');
  const [aiResults, setAiResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Handlers
  const runMongoDemo = async () => {
    setMongoLoading(true);
    try {
      const res = await api.get(`/resources?search=${encodeURIComponent(mongoSearch)}`);
      setMongoResults({
        collection: 'resources',
        indexUsed: '{ title: "text", description: "text" }',
        queryExecuted: `db.resources.find({ "$text": { "$search": "${mongoSearch}" } })`,
        results: res.data
      });
    } catch (e) {
      alert("Mongo Query Error");
    } finally {
      setMongoLoading(false);
    }
  };

  const runNeo4jDemo = async () => {
    setGraphLoading(true);
    try {
      const res = await api.get(`/graph/recommendations/subject/${graphSubject}`);
      setGraphResults(res.data);
    } catch (e) {
      alert("Neo4j Cypher Query Error");
    } finally {
      setGraphLoading(false);
    }
  };

  const runTemporalDemo = async () => {
    setTemporalLoading(true);
    try {
      const res = await api.get(`/temporal/resource/${temporalResId}/as-of?timestamp=${encodeURIComponent(temporalAsOf)}`);
      setTemporalResults(res.data);
    } catch (e) {
      alert("Temporal SQL Error");
    } finally {
      setTemporalLoading(false);
    }
  };

  const runSpatialDemo = async () => {
    setSpatialLoading(true);
    try {
      const res = await api.get(`/spatial/nearby?latitude=13.0102&longitude=80.2354&radiusMeters=${spatialRadius}`);
      setSpatialResults(res.data);
    } catch (e) {
      alert("PostGIS Spatial Error");
    } finally {
      setSpatialLoading(false);
    }
  };

  const runEcaDemo = async () => {
    setEcaLoading(true);
    try {
      const res = await api.post(`/eca/trigger-demo?resourceId=RES_CALC_001&newStatus=${ecaStatus}`);
      setEcaResults(res.data);
    } catch (e) {
      alert("ECA Trigger Simulation Error");
    } finally {
      setEcaLoading(false);
    }
  };

  const runAiDemo = async () => {
    setAiLoading(true);
    try {
      const res = await api.post(`/ai/search?query=${encodeURIComponent(aiQuery)}`);
      setAiResults(res.data);
    } catch (e) {
      alert("AI Search Error");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl border border-amber-800/40">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold tracking-tight">Advanced Database Viva Demonstration Lab</h1>
        </div>
        <p className="text-amber-200/80 text-sm max-w-3xl leading-relaxed">
          Interactive faculty review dashboard. Execute live operations across MongoDB NoSQL, Neo4j Cypher Graph, PostgreSQL Temporal System-Versioned Tables, PostGIS Spatial GIST Indexing, Active Database PL/pgSQL ECA Triggers, and Gemini AI Intent Parser.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('mongo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'mongo' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" /> 1. MongoDB NoSQL
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'graph' ? 'bg-cyan-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" /> 2. Neo4j Graph Cypher
        </button>

        <button
          onClick={() => setActiveTab('temporal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'temporal' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" /> 3. Temporal DB Time Travel
        </button>

        <button
          onClick={() => setActiveTab('spatial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'spatial' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" /> 4. PostGIS Spatial
        </button>

        <button
          onClick={() => setActiveTab('eca')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'eca' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" /> 5. Active DB ECA Triggers
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'ai' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> 6. Gemini AI NLU Intent
        </button>
      </div>

      {/* Tab 1: MongoDB */}
      {activeTab === 'mongo' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" /> MongoDB Document Query & Index Visualizer
              </h2>
              <p className="text-xs text-slate-500 mt-1">Executes full-text indexing search across BSON resource collections.</p>
            </div>
            <button
              onClick={runMongoDemo}
              disabled={mongoLoading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Play className="w-4 h-4" /> {mongoLoading ? 'Running...' : 'Execute Mongo Query'}
            </button>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={mongoSearch}
              onChange={(e) => setMongoSearch(e.target.value)}
              placeholder="Search keyword..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          {mongoResults && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs shadow-inner">
                <div className="text-slate-400 mb-1">Index Used: {mongoResults.indexUsed}</div>
                <div>{mongoResults.queryExecuted}</div>
              </div>
              <pre className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono max-h-72 overflow-y-auto">
                {JSON.stringify(mongoResults.results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Neo4j Graph */}
      {activeTab === 'graph' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-600" /> Neo4j Multi-Hop Graph Traversal
              </h2>
              <p className="text-xs text-slate-500 mt-1">Executes Cypher pattern matching across (Student)&rarr;[:WORKED_ON]&rarr;(Project)&rarr;[:USES]&rarr;(Resource).</p>
            </div>
            <button
              onClick={runNeo4jDemo}
              disabled={graphLoading}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Play className="w-4 h-4" /> {graphLoading ? 'Traversing Graph...' : 'Run Cypher Query'}
            </button>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={graphSubject}
              onChange={(e) => setGraphSubject(e.target.value)}
              placeholder="Subject Code (e.g. SUB_DBMS_501)..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-600"
            />
          </div>

          {graphResults && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-cyan-300 p-4 rounded-2xl font-mono text-xs shadow-inner">
                <div className="text-slate-400 mb-1">Cypher Query Executed:</div>
                <div>{graphResults.cypherQuery}</div>
              </div>
              <pre className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono max-h-72 overflow-y-auto">
                {JSON.stringify(graphResults.results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Temporal Database */}
      {activeTab === 'temporal' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> Temporal System-Versioned Point-in-Time Query
              </h2>
              <p className="text-xs text-slate-500 mt-1">Queries PostgreSQL interval timestamps (valid_from &lt;= timestamp &lt; valid_to).</p>
            </div>
            <button
              onClick={runTemporalDemo}
              disabled={temporalLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Play className="w-4 h-4" /> {temporalLoading ? 'Traveling Time...' : 'Query As-Of State'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={temporalResId}
              onChange={(e) => setTemporalResId(e.target.value)}
              placeholder="Resource ID..."
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
            />
            <input
              type="text"
              value={temporalAsOf}
              onChange={(e) => setTemporalAsOf(e.target.value)}
              placeholder="Timestamp (e.g. 2026-03-20T14:30:00Z)..."
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 font-mono"
            />
          </div>

          {temporalResults && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-indigo-300 p-4 rounded-2xl font-mono text-xs shadow-inner">
                <div className="text-slate-400 mb-1">SQL Temporal Query Executed:</div>
                <div>{temporalResults.sqlQuery}</div>
              </div>
              <pre className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono">
                {JSON.stringify(temporalResults.asOfState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: PostGIS Spatial */}
      {activeTab === 'spatial' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" /> PostGIS ST_DWithin & ST_Distance Spatial Query
              </h2>
              <p className="text-xs text-slate-500 mt-1">Executes GIST-indexed spatial distance searches on GEOGRAPHY(Point, 4326).</p>
            </div>
            <button
              onClick={runSpatialDemo}
              disabled={spatialLoading}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Play className="w-4 h-4" /> {spatialLoading ? 'Searching Spatial...' : 'Run ST_DWithin'}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs font-bold text-slate-700">Radius Range: {spatialRadius}m</label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={spatialRadius}
              onChange={(e) => setSpatialRadius(Number(e.target.value))}
              className="flex-1"
            />
          </div>

          {spatialResults && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-rose-300 p-4 rounded-2xl font-mono text-xs shadow-inner">
                <div className="text-slate-400 mb-1">PostGIS SQL Executed:</div>
                <div>{spatialResults.sqlQuery}</div>
              </div>
              <pre className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono max-h-72 overflow-y-auto">
                {JSON.stringify(spatialResults.results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Active Database ECA Triggers */}
      {activeTab === 'eca' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" /> Active Database PL/pgSQL Event-Condition-Action Trigger
              </h2>
              <p className="text-xs text-slate-500 mt-1">Fires database event &rarr; evaluates PL/pgSQL condition &rarr; auto-generates notification.</p>
            </div>
            <button
              onClick={runEcaDemo}
              disabled={ecaLoading}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Play className="w-4 h-4" /> {ecaLoading ? 'Firing Event...' : 'Fire Event & Trigger'}
            </button>
          </div>

          <div className="flex gap-4">
            <select
              value={ecaStatus}
              onChange={(e) => setEcaStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white"
            >
              <option value="available">Transition to 'available' (Fires ECA Rule 1)</option>
              <option value="borrowed">Transition to 'borrowed'</option>
            </select>
          </div>

          {ecaResults && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-amber-300 p-4 rounded-2xl font-mono text-xs shadow-inner space-y-2">
                <div>⚡ EVENT: {ecaResults.event}</div>
                <div>🔍 CONDITION: {ecaResults.conditionEvaluated}</div>
                <div className="text-emerald-400">⚡ ACTION: {ecaResults.actionExecuted}</div>
              </div>
              <pre className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono max-h-72 overflow-y-auto">
                {JSON.stringify(ecaResults.generatedNotifications, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: AI Gemini NLU */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" /> Gemini AI Natural Language Intent Parser & Multi-DB Scoring
              </h2>
              <p className="text-xs text-slate-500 mt-1">Converts plain text intent into JSON DB filters, then applies 6-Factor Hybrid Ranking Formula.</p>
            </div>
            <button
              onClick={runAiDemo}
              disabled={aiLoading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Play className="w-4 h-4" /> {aiLoading ? 'Parsing Intent...' : 'Parse & Score Query'}
            </button>
          </div>

          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Natural language prompt..."
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600"
          />

          {aiResults && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-purple-300 p-4 rounded-2xl font-mono text-xs shadow-inner">
                <div className="text-slate-400 mb-1">Parsed AI Intent JSON:</div>
                <div>{JSON.stringify(aiResults.parsedIntent, null, 2)}</div>
              </div>
              <pre className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono max-h-72 overflow-y-auto">
                {JSON.stringify(aiResults.recommendations, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

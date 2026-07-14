import type { Question } from '../game/types'

export const QUESTIONS: Question[] = [
  {
    "id": "Q22",
    "category": "code",
    "points": 50,
    "type": "multiple",
    "prompt": "An engineer used the agent yesterday to analyze a legacy authentication module, identifying two distinct refactoring approaches: extracting a microservice versus refactoring in-place. Today, they want to explore both approaches in depth—having the agent propose specific code changes for each—before deciding which to implement.\nWhat's the most effective way to structure this exploration?",
    "options": [
      "Resume yesterday's session to explore the first approach, then start a new session for the second, manually recreating the original context.",
      "Start two fresh sessions, manually providing a summary of yesterday's analysis findings to establish context.",
      "Resume yesterday's session and explore both approaches sequentially within the same conversation thread.",
      "Use `fork_session` to create two branches from yesterday's analysis, exploring one approach in each fork."
    ],
    "correctAnswer": 3,
    "explanation": "Forking from yesterday's session gives each approach its own independent context starting from the same analysis baseline — clean, parallel, no contamination."
  },
  {
    "id": "Q70",
    "category": "code",
    "points": 150,
    "type": "multiple",
    "prompt": "After a long, expensive analysis session in which the agent built up deep understanding of a module, an engineer wants to prototype two competing refactors of that same module. Each prototype should start from the exact analyzed state, and the two attempts must not contaminate each other's context so the trade-offs can be compared cleanly.\nWhat's the cleanest way to structure this?",
    "options": [
      "Continue in the same session, doing refactor A fully, then refactor B, in sequence.",
      "Start two brand-new sessions and re-run the entire analysis in each.",
      "Use `fork_session` to branch the analyzed session into two independent lines, developing one refactor in each fork.",
      "Run both refactors interleaved in one session and separate them afterward by tagging messages."
    ],
    "correctAnswer": 2,
    "explanation": "Forking gives each refactor its own isolated context that starts from the identical analysis baseline — parallel exploration with zero cross-contamination and no re-analysis."
  },
  {
    "id": "Q51",
    "category": "extraction",
    "points": 150,
    "type": "multiple",
    "prompt": "Your extraction pipeline processes restaurant menus and must output structured JSON with fields for item names, descriptions, prices, and dietary tags. Some menus use inconsistent formatting—prices as \"$12\" vs \"12.00\", dietary info as icons vs text.\nWhat's the most reliable approach?",
    "options": [
      "Use separate extraction calls for each field to ensure consistent handling of each type.",
      "Extract data as-is and normalize formats in post-processing code after Claude returns.",
      "Request multiple extraction attempts per document and select the most common format.",
      "Define a strict output schema and include format normalization rules in your prompt."
    ],
    "correctAnswer": 3,
    "explanation": "Strict schema + explicit normalization rules ('prices as decimal with two places', 'dietary as enumerated tags') lets the model both extract and normalize in one pass."
  },
  {
    "id": "Q43",
    "category": "support",
    "points": 100,
    "type": "multiple",
    "prompt": "When implementing your `lookup_order` MCP tool, the backend sometimes returns errors (e.g., \"Order not found\" or temporary database failures).\nWhat is the correct pattern for communicating these errors back to the agent?",
    "options": [
      "Log the error server-side and return an empty result to avoid confusing the model",
      "Return the error message in the tool result content with the isError flag set to true",
      "Throw an exception from the tool handler so the agent framework can catch and log it",
      "Return a success response with a \"status\" field indicating the error type"
    ],
    "correctAnswer": 1,
    "explanation": "MCP's designed pattern: put the error text in the content field and mark isError=true. Claude sees both the failure flag and a readable message to reason about."
  },
  {
    "id": "Q12",
    "category": "research",
    "points": 150,
    "type": "multiple",
    "prompt": "The coordinator provides detailed step-by-step instructions to the web search subagent, specifying exact search queries, source priorities, and date filters. Production monitoring reveals three issues: (1) the subagent reports \"insufficient results\" rather than trying alternative approaches when pre-specified searches fail, (2) research quality drops for emerging topics that don't match expected patterns, and (3) the subagent rarely surfaces valuable tangential sources.\nWhat's the most effective way to improve subagent adaptability?",
    "options": [
      "Remove procedural details entirely, delegating with simple goals like \"research X thoroughly\" and relying on the subagent's general capabilities.",
      "Add explicit fallback directives to the detailed instructions: \"If specified searches yield fewer than N results, attempt alternative query formulations before reporting failure.\"",
      "Implement a topic classification step where the coordinator categorizes requests as \"well-defined\" or \"exploratory\" and uses different instruction styles for each category.",
      "Specify research goals and quality criteria (coverage breadth, source diversity, recency) rather than procedural steps, letting the subagent determine its search strategy."
    ],
    "correctAnswer": 3,
    "explanation": "Delegate intent and quality bars, not procedures. The subagent can then choose queries, follow promising tangents, and recover from dead ends on its own."
  },
  {
    "id": "Q90",
    "category": "code",
    "points": 100,
    "type": "multiple",
    "prompt": "You're deciding whether to invest in building a custom MCP server that offers a \"search the codebase\" tool, even though Claude Code already ships with the built-in Grep and Glob tools that cover basic text and filename search.\nWhen is building the MCP tool the right call?",
    "options": [
      "Always build MCP tools; built-ins are deprecated in agentic setups.",
      "Never build MCP tools when a built-in exists, even for very different capabilities.",
      "When it provides capability the built-ins lack (e.g., semantic/AST-aware queries); if it just duplicates Grep, prefer the built-in.",
      "Build it only if the built-in is temporarily failing."
    ],
    "correctAnswer": 2,
    "explanation": "Add an MCP tool when it offers something the built-ins genuinely can't do. Duplicating an existing built-in just adds selection ambiguity and maintenance for no gain."
  },
  {
    "id": "Q95",
    "category": "support",
    "points": 100,
    "type": "multiple",
    "prompt": "Every support conversation your agent handles begins with the same 8K-token block in the system prompt: a policy manual plus tool documentation that never changes between requests. Latency and cost are both high, and profiling shows this identical prefix is being reprocessed from scratch on every single API call.\nWhat's the most effective optimization?",
    "options": [
      "Enable prompt caching on the stable prefix so the repeated policy/tool content is reused instead of reprocessed each call.",
      "Delete the policy manual from the prompt and hope the model recalls it.",
      "Summarize the manual to 1K tokens, accepting the loss of detail.",
      "Lower `max_tokens` to reduce per-request cost."
    ],
    "correctAnswer": 0,
    "explanation": "A large, unchanging prefix reused across requests is the textbook case for prompt caching — the cached prefix cuts both latency and cost without sacrificing any content."
  },
  {
    "id": "Q86",
    "category": "extraction",
    "points": 50,
    "type": "multiple",
    "prompt": "In your extraction schema the model keeps swapping two numeric fields — `net_amount` and `gross_amount` — placing the wrong figure in each. The field names alone clearly aren't enough for the model to tell them apart in ambiguous documents.\nWhat's the most effective fix at the schema level?",
    "options": [
      "Rename both fields to `amount_1` and `amount_2`.",
      "Make both fields required so neither is skipped.",
      "Add clear descriptions to each field in the schema explaining exactly what it means and how to distinguish them.",
      "Merge them into a single `amount` field."
    ],
    "correctAnswer": 2,
    "explanation": "Field descriptions in the schema are read by the model and are the primary lever for disambiguation — spelling out what `net` vs `gross` means resolves the confusion at the source."
  },
  {
    "id": "Q60",
    "category": "extraction",
    "points": 200,
    "type": "multiple",
    "prompt": "After your daily batch of 10,000 documents completes, 300 documents (3%) failed with \"`context_length_exceeded`\" errors. The results file identifies each failure by `custom_id`.\nWhat's the most cost-effective approach to process these failures?",
    "options": [
      "Reprocess the entire batch with prompt caching enabled to reduce the cost of retrying requests with identical system prompts",
      "Resubmit only the 300 failed documents after chunking them into smaller pieces, then combine the partial extractions",
      "Resubmit the entire 10,000 document batch using a model tier with a larger context window",
      "Increase the `max_tokens` parameter for the 300 failed documents and resubmit them in a new batch"
    ],
    "correctAnswer": 1,
    "explanation": "Targeted, and it addresses the actual cause (input too long). Chunk the oversized docs, extract per chunk, then merge — minimum tokens, fixes the specific failure mode."
  },
  {
    "id": "Q41",
    "category": "support",
    "points": 150,
    "type": "multiple",
    "prompt": "Your agent is handling a billing dispute. After calling `get_customer` and `lookup_order`, it identifies that the dispute involves a promotional pricing error requiring manager approval—beyond the agent's authorization level.\nHow should the workflow handle this mid-process escalation?",
    "options": [
      "Call `escalate_to_human` passing only the customer's original message.",
      "Compile a structured handoff with customer details, order info, and the identified issue before calling `escalate_to_human`.",
      "Attempt the refund with `process_refund` anyway, escalating only if the system rejects the transaction.",
      "Persist the complete conversation and tool response history to a database, then call `escalate_to_human` with a reference ID."
    ],
    "correctAnswer": 1,
    "explanation": "A structured brief (who, what order, what issue, why it exceeds auth) lets the human agent pick up instantly. That's the mid-process escalation pattern."
  },
  {
    "id": "Q61",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "You're implementing the agentic loop for a research coordinator by calling the Messages API directly, without a framework to manage the turn cycle for you. You send the user's request plus your tool definitions, and Claude's response comes back with `stop_reason: \"tool_use\"` and a single `tool_use` block requesting the `web_search` tool with a specific query. Your code currently just returns Claude's text to the caller and stops.\nWhat must your loop do next to continue correctly?",
    "options": [
      "Treat `tool_use` as the end of the turn and return Claude's text to the user, since the model has finished reasoning.",
      "Execute the requested tool, then send a new request with the full prior messages plus a `tool_result` block matching the `tool_use` id.",
      "Re-send the identical request unchanged; the model will retry the tool call itself on the second pass.",
      "Increase `max_tokens` and resend, because `tool_use` indicates the response was truncated before completion."
    ],
    "correctAnswer": 1,
    "explanation": "`stop_reason: tool_use` means Claude paused to call a tool. You run the tool and append a `tool_result` (with the matching `tool_use_id`) to the messages, then call the API again so the model can continue."
  },
  {
    "id": "Q47",
    "category": "extraction",
    "points": 100,
    "type": "multiple",
    "prompt": "Your schema includes a skills: string[] field. Production monitoring reveals three consistency issues: (1) compound phrases like \"Python and SQL\" are sometimes kept as one entry, sometimes split; (2) implied but unstated skills occasionally appear in extractions; (3) similar documents produce wildly different array lengths (5-10 vs 40+ entries). Your prompt currently says \"Extract all skills mentioned.\"\nWhat's the most effective improvement?",
    "options": [
      "Add few-shot examples demonstrating compound phrase handling, explicit mention criteria, and appropriate entry granularity.",
      "Add constraints: \"Extract 10-20 skills maximum, one skill per entry, only explicitly named skills.\"",
      "Add post-extraction normalization that maps skills to a canonical taxonomy and deduplicates similar entries.",
      "Enrich the schema to {skill: string, confidence: float, `source_quote`: string}[] to capture extraction metadata."
    ],
    "correctAnswer": 0,
    "explanation": "All three issues are about the model's interpretation of what counts as 'a skill.' Few-shot examples teach the pattern concretely — split vs. not-split, mentioned vs. inferred, appropriate granularity."
  },
  {
    "id": "Q21",
    "category": "code",
    "points": 200,
    "type": "multiple",
    "prompt": "Your codebase exploration tool stores session IDs to allow engineers to continue investigations across work sessions. An engineer spent an hour yesterday analyzing a legacy authentication module, building context about its architecture and dependencies. They want to continue today. The session ID is valid, but version control shows 3 of the 12 files the agent previously read were modified overnight by a teammate's merge.\nWhat approach best balances efficiency and accuracy?",
    "options": [
      "Resume the session without informing the agent about the changed files",
      "Start a fresh session to ensure the agent works with current codebase state without stale assumptions",
      "Resume the session and inform the agent which specific files changed for targeted re-analysis",
      "Resume the session and immediately have the agent re-read all 12 previously analyzed files"
    ],
    "correctAnswer": 2,
    "explanation": "Keeps the expensive context you already built, while telling the agent exactly which 3 files to re-read — minimum waste, maximum accuracy."
  },
  {
    "id": "Q5",
    "category": "research",
    "points": 50,
    "type": "multiple",
    "prompt": "In production, you observe that simple fact-checking queries (e.g., \"What year was the Paris Climate Agreement signed?\") traverse all four subagents sequentially, consuming 40+ seconds and significant tokens per query. Complex comparative research benefits from the full pipeline. Your query distribution is diverse and evolving as users discover new applications.\nWhat's the most effective approach to optimize for varying query complexity?",
    "options": [
      "Implement pattern-based routing that categorizes queries by structure (single-fact vs. comparative vs. analytical) and maps each category to a predefined subagent combination.",
      "Create a fast-path for factual questions that bypasses subagents entirely, routing all other queries through the complete pipeline to ensure research thoroughness.",
      "Have the coordinator analyze each query and dynamically decide which subagents to invoke based on its assessment of query requirements.",
      "Train a query complexity classifier on labeled historical data to predict optimal subagent combinations, retraining periodically as query patterns evolve."
    ],
    "correctAnswer": 2,
    "explanation": "Letting the coordinator LLM reason about each query and pick only the subagents it needs adapts naturally to an evolving, diverse query distribution — this is the strength of the orchestrator pattern."
  },
  {
    "id": "Q28",
    "category": "code",
    "points": 150,
    "type": "multiple",
    "prompt": "Your agent has analyzed a complex service module—reading 23 source files, tracing request flows, and identifying error handling patterns. A developer wants to compare two testing strategies before committing to one: end-to-end tests with mocked external services vs. snapshot tests capturing expected outputs. They need to independently develop both approaches to evaluate trade-offs.\nHow should you manage the sessions?",
    "options": [
      "Export the analysis session's key findings to a file, then create two new sessions that reference this file.",
      "Resume the analysis session with `fork_session` enabled, creating a separate branch for each testing strategy.",
      "Start two fresh sessions, having each re-read the relevant source files before beginning.",
      "Continue in the original session, developing end-to-end tests first, then snapshot tests sequentially."
    ],
    "correctAnswer": 1,
    "explanation": "Forking gives each strategy its own independent context starting from the exact analysis baseline — no cross-contamination, no re-analysis."
  },
  {
    "id": "Q13",
    "category": "research",
    "points": 50,
    "type": "multiple",
    "prompt": "Production monitoring shows that follow-up queries like \"summarize what we learned about market trends\" consistently take 40+ seconds. Investigation reveals the coordinator spawns the synthesis subagent for each summarization request, passing 80K+ tokens of accumulated findings. The coordinator already has these findings in its context from orchestrating the research.\nWhat's the most effective way to improve response time for these follow-up summaries?",
    "options": [
      "Pre-generate and cache summaries at multiple granularities whenever new findings accumulate.",
      "Have the coordinator handle straightforward summarization requests directly using its existing context, reserving subagent spawning for complex analysis.",
      "Enable prompt caching on the synthesis subagent to reduce the overhead of repeatedly transferring the same research findings.",
      "Spawn the synthesis subagent with reduced context and have it request specific findings from the coordinator on-demand."
    ],
    "correctAnswer": 1,
    "explanation": "If the coordinator already has the findings, spawning a subagent to re-ingest 80K tokens is pure overhead. Let the coordinator answer simple follow-ups itself."
  },
  {
    "id": "Q48",
    "category": "extraction",
    "points": 150,
    "type": "multiple",
    "prompt": "Your system has been operating with 100% human review for 3 months. Analysis shows that extractions with model confidence >90% have 97% accuracy overall. To reduce reviewer workload, you plan to automate high-confidence extractions. Before deploying, what validation step is most critical?",
    "options": [
      "Analyze accuracy by document type and field to verify high-confidence extractions perform consistently across all segments, not just in aggregate.",
      "Compare accuracy at different confidence thresholds (85%, 90%, 95%) to find the optimal cutoff that maximizes automation while minimizing errors.",
      "Run a two-week pilot routing 25% of high-confidence extractions directly to downstream systems and monitor error reports.",
      "Verify that 97% accuracy meets requirements for all downstream systems that consume the extracted data."
    ],
    "correctAnswer": 0,
    "explanation": "Aggregate accuracy hides segment failures — one document type could be 70% while others are 99%. Auto-routing by overall number alone risks systemic errors in the weak segments."
  },
  {
    "id": "Q4",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "The web search agent has gathered several relevant sources for a research topic. The document analysis agent now needs to examine these sources.\nHow does information typically flow between these two specialized subagents?",
    "options": [
      "The agents communicate through an event-driven message queue, with the document analysis agent subscribing to web search completion events.",
      "The web search agent directly invokes the document analysis agent, passing the discovered sources as parameters.",
      "The coordinator agent receives the web search agent's output and includes relevant findings in the prompt when invoking the document analysis agent.",
      "Both agents access a shared memory store where the web search agent writes findings and the document analysis agent reads them."
    ],
    "correctAnswer": 2,
    "explanation": "In an orchestrator-worker pattern the coordinator is the hub. It collects each subagent's output and explicitly forwards the relevant parts into the next subagent's prompt."
  },
  {
    "id": "Q19",
    "category": "code",
    "points": 100,
    "type": "multiple",
    "prompt": "An engineer used `Claude Code` yesterday to investigate authentication flows in a legacy monolith, building up significant context over a 2-hour session. Today she wants to continue that specific investigation. She's worked on three other codebases since then and knows the session was named \"auth-deep-dive\".\nHow should she resume?",
    "options": [
      "Start fresh and re-read the same files",
      "Use `--session-id` with the UUID from yesterday's session transcript file",
      "Use `--continue` to pick up where the most recent conversation left off",
      "Use `--resume` auth-deep-dive to load that specific session by name"
    ],
    "correctAnswer": 3,
    "explanation": "`--resume` with the session name is designed for exactly this: pick a specific prior session out of many, by the name you gave it."
  },
  {
    "id": "Q92",
    "category": "support",
    "points": 200,
    "type": "multiple",
    "prompt": "Your `process_refund` tool sometimes gets invoked with a missing order id or an ambiguous, unspecified amount, and each of those bad calls produces a backend error and a failed customer interaction. The tool currently accepts loose input and only validates on the backend.\nWhich tool-design change most reduces these malformed calls?",
    "options": [
      "Accept any input and validate only on the backend, returning errors after the fact.",
      "Add a note in the system prompt asking the model to be careful.",
      "Let the tool guess missing values from conversation context.",
      "Make order id and amount required, well-described parameters in the tool's `input_schema` so the model must supply them correctly."
    ],
    "correctAnswer": 3,
    "explanation": "A precise input_schema with required, clearly-described parameters constrains the model to produce valid calls up front, preventing whole classes of malformed invocations."
  },
  {
    "id": "Q94",
    "category": "support",
    "points": 50,
    "type": "multiple",
    "prompt": "After connecting five separate MCP servers to your agent, its tool selection got noticeably worse — it now sometimes reaches for irrelevant tools that don't fit the task. You count roughly 40 tools exposed in total, and a large share of them are never actually used in your workflows.\nWhat's the most effective remedy?",
    "options": [
      "Keep all 40 tools; more options always help the model.",
      "Rename all tools with a numeric prefix to impose an order.",
      "Curate the exposed toolset down to the tools the agent actually needs, reducing selection ambiguity.",
      "Raise `max_tokens` so the model can consider every tool."
    ],
    "correctAnswer": 2,
    "explanation": "A bloated toolset increases the chance of mis-selection. Curating down to the relevant tools sharpens the model's choices — fewer, well-scoped tools beat a sprawling catalog."
  },
  {
    "id": "Q97",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "A long research session is approaching the model's context limit, but findings from early in the session still matter for the final report you're about to generate. You need to stay under the limit without throwing away the information that still counts.\nWhat approach preserves the most useful information within the budget?",
    "options": [
      "Truncate the oldest half of the messages outright.",
      "Progressively summarize the older, stable portions into compact findings while keeping the active thread verbatim.",
      "Do nothing and let the API drop whatever doesn't fit.",
      "Restart the session from scratch to reclaim the whole window."
    ],
    "correctAnswer": 1,
    "explanation": "Progressive summarization compresses settled earlier material into dense findings while preserving the active work verbatim — the standard way to stay under the limit without losing important signal."
  },
  {
    "id": "Q45",
    "category": "support",
    "points": 200,
    "type": "multiple",
    "prompt": "Your agent has called `lookup_order` multiple times while investigating a customer's return requests. Each response includes 40+ fields (items, shipping details, payment info, status history). Tool outputs now represent the majority of the conversation's context. The customer mentions two more orders they want to discuss.\nWhat's the most effective approach before making additional lookups?",
    "options": [
      "Extract only return-relevant fields (items, purchase date, return window, status) from each existing order response, removing verbose details",
      "Have the model generate a natural language summary of each order's key details, replacing structured responses with prose descriptions",
      "Move all tool responses to a vector database with semantic indexing, retrieving relevant portions as the conversation continues",
      "Proceed with additional lookups without modifying the existing tool output context"
    ],
    "correctAnswer": 0,
    "explanation": "Keep the fields that matter for the task and drop the rest. This directly addresses the context-bloat problem before you add two more lookups."
  },
  {
    "id": "Q29",
    "category": "code",
    "points": 200,
    "type": "multiple",
    "prompt": "Your agent needs to insert a new helper function into the middle of a 150-line utility module, between two existing functions. The Edit tool fails because its `old_string` parameter cannot find unique text to match — the file has repetitive docstrings, variable names, and structural patterns.\nWhat's the most reliable way to complete this insertion?",
    "options": [
      "Use Edit with an extremely long `old_string` capturing 30+ lines of context to guarantee uniqueness",
      "Use Edit's `replace_all` parameter to target a common pattern and embed the new function in the replacement text",
      "Use Bash to append the function definition to the end of the file using heredoc syntax",
      "Use Read to load the file, add the function at the appropriate location, then Write the updated file"
    ],
    "correctAnswer": 3,
    "explanation": "When Edit's unique-match contract can't be satisfied in a repetitive file, fall back to Read → modify in memory at the intended line → Write the full file back."
  },
  {
    "id": "Q59",
    "category": "extraction",
    "points": 200,
    "type": "multiple",
    "prompt": "After deployment, you find that 12% of extractions contain semantic errors that pass JSON schema validation (e.g., a duration like \"30 minutes\" incorrectly placed in an ingredient quantity field). Human reviewers have capacity to check only 20% of extractions.\nWhich approach most effectively allocates reviewer attention?",
    "options": [
      "Have the model output field-level confidence scores, then calibrate review thresholds using a labeled validation set.",
      "Randomly sample 20% of extractions for review, using corrections to track accuracy and identify error patterns.",
      "Prioritize review of all extractions where required fields are empty or explicitly marked as not found.",
      "Review all extractions from documents with formatting anomalies such as unusual layouts or mixed content types."
    ],
    "correctAnswer": 0,
    "explanation": "Field-level confidence lets you route the low-confidence 20% — which is where the 12% semantic errors concentrate — to humans. Calibration makes the threshold choice data-driven."
  },
  {
    "id": "Q2",
    "category": "research",
    "points": 50,
    "type": "multiple",
    "prompt": "After the web search agent finds 25 sources (120K tokens of raw content), the document analysis agent extracts key insights (15K tokens), and the synthesis agent produces a coherent narrative draft (3K tokens), the coordinator must pass context to the report generation agent for the final output with proper source citations.\nWhat context-passing strategy provides the best balance of completeness and efficiency?",
    "options": [
      "Pass only the synthesis draft and have a separate post-processing pipeline match claims to sources and insert citations after the report is generated.",
      "Pass the synthesis draft along with a structured source index that maps key claims to their source URLs and relevant excerpts.",
      "Pass a condensed summary of all prior stages that preserves the main findings and attributes them to sources by name only.",
      "Pass the full accumulated context from all prior agents."
    ],
    "correctAnswer": 1,
    "explanation": "The synthesis gives the narrative; the source index gives the report generator exactly the binding it needs to cite without re-reading 120K tokens of raw content."
  },
  {
    "id": "Q65",
    "category": "research",
    "points": 200,
    "type": "multiple",
    "prompt": "You run a four-stage research pipeline (search → analyze → synthesize → write) over a batch of 20 sources. The analyze subagent crashes after processing only 8 of the 20 sources. On inspection, the search results for all 20 and the 8 completed analyses are safely persisted; the remaining 12 sources were never analyzed.\nHow should the coordinator resume for the best balance of fidelity and efficiency?",
    "options": [
      "Restart the entire pipeline from search to guarantee a consistent run.",
      "Re-run analysis only on the 12 unprocessed sources, then merge with the 8 completed analyses before synthesis.",
      "Skip the 12 remaining sources and synthesize from the 8 analyses already done.",
      "Feed the raw 20 sources directly to synthesis and drop the analyze stage entirely."
    ],
    "correctAnswer": 1,
    "explanation": "Preserve completed work and only redo what's missing: analyze the remaining 12, merge with the 8, then synthesize. No wasted recomputation, no lost coverage."
  },
  {
    "id": "Q15",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "The coordinator agent has `AgentDefinitions` configured for all four specialized subagents, each with appropriate descriptions, prompts, and tool restrictions. During testing, you notice the coordinator correctly reasons about when to delegate—it generates messages like \"I'll ask the web search agent to find sources on this topic\"—but no subagent execution ever occurs. The coordinator then proceeds as if the delegation happened and continues with incomplete information. Logs show no errors.\nWhat is the most likely cause?",
    "options": [
      "The coordinator's `max_tokens` setting is too low, causing the Task tool invocation to be truncated before the subagent type parameter can be specified.",
      "The `AgentDefinitions` are configured correctly, but the coordinator's system prompt doesn't explicitly list the available subagent types, preventing the model from knowing they can be invoked.",
      "The coordinator's allowedTools configuration doesn't include \"Task\", so while it can reason about delegation, it cannot invoke the tool required to spawn subagents.",
      "Subagent context isolation means task descriptions from the coordinator don't automatically reach subagents; you need to configure explicit context forwarding in ClaudeAgentOptions."
    ],
    "correctAnswer": 2,
    "explanation": "Without the Task tool in allowedTools, the coordinator can talk about delegating but has no way to actually call a subagent — which matches the 'reasons about it, no execution, no errors' symptom."
  },
  {
    "id": "Q80",
    "category": "extraction",
    "points": 100,
    "type": "multiple",
    "prompt": "You need Claude to return product data (name, price, dimensions, tags) as strict JSON that your downstream service can deserialize directly into typed objects, with no brittle text-parsing or cleanup layer in between.\nWhat's the canonical mechanism for getting reliable structured output?",
    "options": [
      "Ask Claude in prose to 'respond only with JSON' and `JSON.parse` the message text.",
      "Request Markdown and strip the code fences before parsing.",
      "Lower temperature to 0 so the text output is always valid JSON.",
      "Define a tool whose `input_schema` is your JSON schema and let Claude 'call' it, so the arguments arrive as schema-validated structured data."
    ],
    "correctAnswer": 3,
    "explanation": "Tool use is the canonical structured-output mechanism: the model emits arguments that conform to your input_schema, so you get validated structured data instead of parsing free-form text."
  },
  {
    "id": "Q17",
    "category": "code",
    "points": 50,
    "type": "multiple",
    "prompt": "An engineer asks the agent to find all callers of a function before removing it. The function is defined in a core library but is also exposed through wrapper modules that rename the function for domain-specific use (e.g., calculateTax in the library becomes computeOrderTax in the orders module).\nWhat exploration strategy will most reliably identify all callers?",
    "options": [
      "Read the library and wrapper modules to identify all exposed names for the function, then Grep for each name across the codebase.",
      "Use Grep to find all files that import from the library or wrapper modules, then read each file to check whether it uses the function.",
      "Use Grep to search for the function's original name across the codebase.",
      "Search for the function name in project documentation to understand intended usage patterns and navigate to documented integration points."
    ],
    "correctAnswer": 0,
    "explanation": "You have to enumerate every name the function is exposed under — otherwise renamed wrappers hide callers. Read the relevant modules, gather all aliases, then grep for each."
  },
  {
    "id": "Q32",
    "category": "support",
    "points": 150,
    "type": "multiple",
    "prompt": "You're implementing the escalation logic for when the agent should call `escalate_to_human`. Your team proposes four different approaches for triggering escalation.\nWhich approach will most reliably identify cases that genuinely require human intervention?",
    "options": [
      "Instruct the agent to escalate when the customer requests a human, when the issue requires policy exceptions, or when the agent cannot make meaningful progress.",
      "Configure the agent to escalate after three consecutive tool calls that fail to resolve the customer's stated issue, ensuring a reasonable attempt before involving a human.",
      "Implement sentiment analysis that monitors for frustration indicators (negative language, repeated questions, exclamation marks) and trigger escalation when the frustration score exceeds a configured threshold.",
      "Build a rules engine that maps specific issue types, customer segments, and product categories to escalation decisions, removing the need for model judgment calls."
    ],
    "correctAnswer": 0,
    "explanation": "Escalation decisions are judgment calls about intent and progress — exactly what LLMs are good at. Clear criteria in natural language outperform rigid rules for the long tail."
  },
  {
    "id": "Q31",
    "category": "support",
    "points": 200,
    "type": "multiple",
    "prompt": "A customer returns 4 hours after their initial session about the same billing dispute. The previous 32-turn session contains `lookup_order` results showing \"Status: PENDING, Expected resolution: 24-48 hours.\" In testing, you observe that when resuming sessions with stale tool results, the agent often references the outdated data in responses (e.g., \"I see your refund is still being processed\") even after subsequent fresh tool calls return different information.\nWhat approach most reliably handles returning customers?",
    "options": [
      "Resume with full history but filter out previous `tool_result` messages before resuming, keeping only the human/assistant turns so the agent must re-fetch needed data.",
      "Start a new session, inject a structured summary of the previous interaction (issue type, actions taken, resolution status), then make fresh tool calls before engaging.",
      "Resume with full history and add a system prompt instruction telling the agent to always prefer the most recent tool results when multiple calls to the same tool exist in context.",
      "Resume with full history and configure the agent to automatically re-call all previously-used tools at session start to ensure data freshness."
    ],
    "correctAnswer": 1,
    "explanation": "A clean session with a summary keeps the narrative continuity while guaranteeing the agent isn't reasoning over stale tool results."
  },
  {
    "id": "Q68",
    "category": "support",
    "points": 150,
    "type": "multiple",
    "prompt": "A customer-support agent is working a return request. It calls `lookup_order`, and the returned `tool_result` shows the item shipped 60 days ago — well past the 30-day return window. The agent now has both `process_refund` and `escalate_to_human` available and must pick one.\nHow does the agentic loop decide which tool to call next?",
    "options": [
      "A hardcoded routing table maps the order's age directly to the next tool, bypassing the model.",
      "The tool itself decides and automatically triggers the next tool in sequence.",
      "The loop always calls the tools in their registered order until one succeeds.",
      "The `tool_result` is appended to the conversation and the model reasons over it to choose the next tool call."
    ],
    "correctAnswer": 3,
    "explanation": "The agentic loop works by feeding each tool_result back into the conversation and letting the model pick the next action. That's how '60 days → outside policy → escalate' gets decided."
  },
  {
    "id": "Q58",
    "category": "extraction",
    "points": 150,
    "type": "multiple",
    "prompt": "Documents arrive continuously throughout business hours and need structured data extracted. To reduce costs, you want to use the `Message Batches API` (50% discount, up-to-24-hour processing window). Your SLA specifies that extraction results must be available within 30 hours of document arrival with 99.9% reliability.\nWhich batching strategy is most appropriate?",
    "options": [
      "Submit batches every 6 hours containing documents from that window",
      "Submit a single batch at end of day containing all documents from that day",
      "Submit batches every 4 hours containing documents from that window",
      "Use the real-time API for all documents instead of batch processing"
    ],
    "correctAnswer": 2,
    "explanation": "Max 4-hour wait + up to 24-hour batch SLO = 28-hour worst case, leaving a 2-hour cushion under the 30-hour SLA to absorb batch variance and hit 99.9%."
  },
  {
    "id": "Q69",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "Users frequently send follow-up questions like \"remind me what the second source concluded\" during a research session. Monitoring shows these take 40+ seconds each. Investigation reveals that for every such follow-up the coordinator spawns the synthesis subagent and re-passes all 80K tokens of accumulated findings — even though the coordinator already holds those exact findings in its own context from orchestrating the research.\nWhat's the most effective fix?",
    "options": [
      "Enable prompt caching on the synthesis subagent so re-passing 80K tokens is cheaper.",
      "Have the coordinator answer simple recall/summary follow-ups directly from its existing context, reserving subagent spawning for genuinely new analysis.",
      "Pre-compute summaries at three granularities every time new findings arrive.",
      "Give the synthesis subagent a tool to pull findings from the coordinator on demand."
    ],
    "correctAnswer": 1,
    "explanation": "Spawning a subagent to re-ingest context the coordinator already has is pure overhead. For simple follow-ups, the coordinator should just answer itself."
  },
  {
    "id": "Q52",
    "category": "extraction",
    "points": 100,
    "type": "multiple",
    "prompt": "Your system extracts event metadata (date, location, organizer, `attendee_count`) from news articles using a JSON schema with all nullable fields. During evaluation, you observe the model frequently generates plausible but incorrect values for fields not mentioned in the article—for example, outputting \"500\" for `attendee_count` when the source contains no attendance information.\nWhat's the most effective way to reduce these false extractions?",
    "options": [
      "Add a post-processing step using a second LLM call to verify each extracted value exists in the source document.",
      "Add prompt instructions to return null for any field where information is not directly stated in the source.",
      "Make all schema fields required (non-nullable) with strict validation rules to ensure the model only outputs verifiable data.",
      "Upgrade to a more capable model tier with improved instruction-following to reduce hallucination tendencies."
    ],
    "correctAnswer": 1,
    "explanation": "The fields are already nullable; the model just needs an explicit instruction to prefer null over a plausible guess. This is the standard fix for schema-aware hallucination."
  },
  {
    "id": "Q33",
    "category": "support",
    "points": 50,
    "type": "multiple",
    "prompt": "After investigating a billing dispute over 25+ turns, you've identified that duplicate charges occurred due to a payment gateway timeout triggering retry logic. The required refund ($847) exceeds your $500 authorization limit. You need to call `escalate_to_human`, and the human agent won't have access to your conversation transcript.\nWhat context should you pass to enable effective resolution?",
    "options": [
      "The customer's original complaint verbatim plus the tool result excerpts showing duplicate transactions.",
      "A structured summary: customer ID, root cause, refund amount, and recommended action.",
      "The complete conversation transcript with all tool results.",
      "Your diagnosis and the refund amount only."
    ],
    "correctAnswer": 1,
    "explanation": "A structured handoff with identifiers, cause, amount, and recommended action is what a human agent needs to pick up the case instantly without re-investigating."
  },
  {
    "id": "Q55",
    "category": "extraction",
    "points": 50,
    "type": "multiple",
    "prompt": "Your pipeline uses a tool called `extract_metadata` with a JSON schema for paper details. You've also defined `lookup_citations` and `verify_doi` tools for enrichment. During testing, you notice that when users include requests like \"extract the metadata and tell me how cited it is,\" Claude sometimes calls `lookup_citations` first, which fails because it needs the DOI that `extract_metadata` would provide.\nWhat's the most effective way to ensure structured metadata extraction happens first?",
    "options": [
      "Set `tool_choice` to \"any\" so Claude must use a tool, combined with system prompt instructions prioritizing `extract_metadata`.",
      "Set `tool_choice` to \"auto\" and reorder the tool definitions so `extract_metadata` appears first in the tools array, since Claude prioritizes earlier-listed tools.",
      "Set `tool_choice` to {\"type\": \"tool\", \"name\": \"`extract_metadata`\"} and process the enrichment requests in subsequent turns after receiving the extracted metadata.",
      "Set `tool_choice` to {\"type\": \"tool\", \"name\": \"`extract_metadata`\"} for every API call in the pipeline, ensuring Claude always extracts metadata before any enrichment can occur."
    ],
    "correctAnswer": 2,
    "explanation": "`tool_choice`=specific-tool deterministically forces `extract_metadata` on the first turn. Then you hand control back to 'auto' to let the model use citations/DOI enrichment with the metadata in context."
  },
  {
    "id": "Q44",
    "category": "support",
    "points": 150,
    "type": "multiple",
    "prompt": "Your `process_refund` tool returns two types of errors: technical errors (\"503 Service Unavailable\", \"Connection timeout\") that are transient (5% of calls), and business errors (\"Order exceeds 30-day return window\", \"Item already refunded\") that are permanent (12% of calls). Monitoring shows the agent wastes 3-4 turns retrying business errors that can never succeed. Currently, both error types return only a plain text message to Claude.\nWhat's the most effective way to reduce wasted retries while improving customer-facing response quality?",
    "options": [
      "Return structured error responses with retryable: false for business errors and a customer-friendly explanation for Claude to use.",
      "Add few-shot examples showing how to distinguish retryable from non-retryable errors by parsing error message text.",
      "Add a `check_refund_eligibility` tool that must be called before `process_refund` to prevent business rule violations.",
      "Implement automatic retry logic at the tool level for technical errors only, passing business errors to Claude without retries."
    ],
    "correctAnswer": 0,
    "explanation": "A retryable flag tells Claude deterministically 'don't retry,' and a ready-made customer-friendly message improves the outgoing reply. Fixes both problems at once."
  },
  {
    "id": "Q54",
    "category": "extraction",
    "points": 200,
    "type": "multiple",
    "prompt": "Your extraction pipeline processes invoices and extracts line items, subtotals, tax amounts, and grand totals. During evaluation, you discover that in 18% of extractions, the sum of extracted line item amounts doesn't match the extracted grand total—sometimes due to OCR errors in the source document, sometimes due to extraction mistakes by the model. Downstream accounting systems reject records with mismatched totals.\nWhat's the most effective approach to improve extraction reliability?",
    "options": [
      "Add a \"`calculated_total`\" field where the model sums extracted line items alongside a \"`stated_total`\" field. Flag records for human review when values differ.",
      "Extract line items and totals independently, then use a separate validation model to reconcile discrepancies by determining which extracted values are most likely correct.",
      "Add few-shot examples demonstrating invoices where extracted line items sum correctly to the stated total, encouraging the model to produce mathematically consistent extractions.",
      "Implement post-processing that automatically adjusts line item amounts proportionally when their sum doesn't match the stated total."
    ],
    "correctAnswer": 0,
    "explanation": "Capturing both values makes the discrepancy a first-class signal — you catch OCR errors and extraction mistakes uniformly, and you can route only the mismatched 18% to humans."
  },
  {
    "id": "Q76",
    "category": "code",
    "points": 100,
    "type": "multiple",
    "prompt": "Your CI runs Claude Code on every commit across many concurrent pull requests. Reviewing the logs, you find that one job's review references files and context from a completely different, unrelated PR that was open at the same time.\nWhat's the most likely cause of this cross-contamination?",
    "options": [
      "Claude Code caches file contents globally across machines by default.",
      "The model's training data included the other PR.",
      "`--output-format json` merges outputs from concurrent jobs.",
      "The jobs are sharing/resuming the same session instead of running in isolation, so context bleeds between unrelated runs."
    ],
    "correctAnswer": 3,
    "explanation": "Automated runs must be session-isolated. If jobs resume or share a session id, one run's accumulated context contaminates another — exactly the cross-PR leakage described."
  },
  {
    "id": "Q27",
    "category": "code",
    "points": 50,
    "type": "multiple",
    "prompt": "After adding an MCP server with specialized code refactoring tools (`extract_function`, `rename_variable`, `inline_function`), you notice the agent still uses basic text manipulation via Write and Bash sed commands for refactoring tasks. The MCP server is connected and healthy. Examining the configuration, you find each MCP tool has a minimal description like \"`extract_function`: extracts a function from code.\"\nWhat's the most effective way to improve adoption of the MCP refactoring tools?",
    "options": [
      "Implement a request classifier that detects refactoring intent and automatically routes those requests to the MCP server before the agent processes them.",
      "Remove the Write tool from the agent's configuration for refactoring sessions so it must use the MCP tools for code modifications.",
      "Accept this as expected behavior since simpler tools like sed are more predictable than specialized refactoring tools.",
      "Enhance the MCP tool descriptions to explain when each tool is preferable to text manipulation and clarify expected inputs and outputs."
    ],
    "correctAnswer": 3,
    "explanation": "Tool selection is driven by the descriptions Claude sees. When the MCP tools say 'extracts a function from code' and Write/sed come with rich documentation, Claude picks Write/sed. Beef up the descriptions."
  },
  {
    "id": "Q8",
    "category": "research",
    "points": 200,
    "type": "multiple",
    "prompt": "Production reviews reveal inconsistent handling of uncertainty in final reports. Sometimes conflicting subagent findings are synthesized into a single confident statement (losing nuance), while other times reports over-hedge with excessive qualifications (becoming unhelpful). When the web search agent returns \"industry analysts estimate $50B market size (methodology varies)\" and the document analysis agent returns \"peer-reviewed study estimates 35B(±7B, 95% CI),\" the coordinator either picks one arbitrarily or produces vague statements like \"the market may be 35B−50B depending on factors.\"\nWhat systematic approach best addresses this?",
    "options": [
      "Configure subagents to only report findings meeting a high-confidence threshold, filtering uncertain information before it reaches the coordinator.",
      "Implement a confidence calibration layer that normalizes subagent uncertainty expressions to standardized probability scores (0.0-1.0), then weight-average findings by their calibrated confidence.",
      "Instruct the synthesis agent to structure reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context.",
      "Add a verification subagent that cross-references findings across sources, only passing claims to synthesis that are corroborated by at least two independent sources."
    ],
    "correctAnswer": 2,
    "explanation": "Report structure that keeps methodological context and separates settled vs. contested claims is how you get nuance without over-hedging."
  },
  {
    "id": "Q98",
    "category": "support",
    "points": 200,
    "type": "multiple",
    "prompt": "You enable prompt caching to cut cost and latency, but the cache hit rate stays stubbornly low. Digging in, you find your prompt places a small per-user profile block at the very top, immediately followed by the large shared policy manual that's identical for every user.\nWhy is caching ineffective here, and what's the fix?",
    "options": [
      "Caching is per-account and can't work with multiple users at all.",
      "The manual is too large to cache; shrink it below the cache size limit.",
      "Caching keys on the prefix; a per-user block up front changes the prefix every request. Put stable shared content first, variable content after, so the shared prefix is cacheable.",
      "Caching only works at temperature 0; raise it and retry."
    ],
    "correctAnswer": 2,
    "explanation": "Prompt caching reuses a stable prefix. If user-specific content sits before the shared manual, the prefix differs every call and nothing hits. Order it stable-first, variable-last so the big shared block stays a cacheable prefix."
  },
  {
    "id": "Q67",
    "category": "research",
    "points": 50,
    "type": "multiple",
    "prompt": "Your research agent must gather background profiles on five unrelated companies before producing a comparison. Each individual lookup takes roughly 20 seconds, and done one after another the whole step takes over a minute and a half, which users complain about. The five lookups don't depend on one another in any way.\nWhat's the most effective way to cut the wall-clock time?",
    "options": [
      "Spawn five subagents in parallel, one per company, then compare their returned summaries.",
      "Do the five lookups sequentially but with a larger `max_tokens` so each finishes faster.",
      "Combine all five companies into a single prompt so the model researches them in one pass.",
      "Cache the first company's result and reuse it as a template for the others."
    ],
    "correctAnswer": 0,
    "explanation": "Independent lookups with no ordering dependency parallelize cleanly: five concurrent subagents turn 5×20s of sequential work into roughly one 20s window."
  },
  {
    "id": "Q26",
    "category": "code",
    "points": 50,
    "type": "multiple",
    "prompt": "An engineer's exploration subagent spent 30 minutes analyzing a legacy payment system, reading 47 files and documenting data flows. The session was interrupted when the engineer's connection dropped. While away, a teammate merged a PR that renamed two utility functions. The engineer wants to continue the same exploration.\nWhat's the most effective approach?",
    "options": [
      "Resume the subagent from its previous transcript without mentioning the changes—the architecture understanding remains valid.",
      "Launch a fresh subagent and include the prior transcript in the initial prompt for context.",
      "Launch a fresh subagent with a summary of prior findings.",
      "Resume the subagent from its previous transcript and inform it about the renamed functions."
    ],
    "correctAnswer": 3,
    "explanation": "Keep the accumulated understanding, and give it a targeted delta about the renames so it can update its mental model — minimum waste, maximum accuracy."
  },
  {
    "id": "Q50",
    "category": "extraction",
    "points": 200,
    "type": "multiple",
    "prompt": "Your extraction system implements automatic retries when validation fails. On each retry, the specific validation error is appended to the prompt. This retry-with-error-feedback approach resolves most failures within 2-3 attempts.\nFor which failure pattern would additional retries be LEAST effective?",
    "options": [
      "The model extracts keywords as a nested object organized by category when the schema requires a flat array of strings",
      "The model extracts citation counts as locale-formatted strings (\"1,234\") when the schema requires integers",
      "The model extracts dates as ISO 8601 datetime strings (\"2023-03-15T00:00:00Z\") when the schema requires only the date portion (YYYY-MM-DD)",
      "The model extracts \"et al.\" for co-authors when the full list exists only in an external document not in the input"
    ],
    "correctAnswer": 3,
    "explanation": "No amount of retrying teaches the model information that isn't in the input. Retry-with-error-feedback only fixes mistakes the model could have gotten right from the source."
  },
  {
    "id": "Q64",
    "category": "code",
    "points": 200,
    "type": "multiple",
    "prompt": "An engineer asks your agent to audit a 900-file monorepo for every remaining use of a deprecated API, ahead of removing it. The code is split across four independent services that share no modules, and the full codebase is far too large to fit in a single context window. Accuracy matters: a missed caller means a production break at removal time.\nWhat orchestration approach is most effective?",
    "options": [
      "Read every file sequentially into the main context until the deprecated API is found, then stop.",
      "Load the four services into a single subagent with an extended context window and let it scan everything at once.",
      "Ask the engineer to manually identify which service is most likely affected and only search that one.",
      "Spawn one subagent per service to search its files in parallel, each returning a structured list of hits, then have the coordinator merge the four lists."
    ],
    "correctAnswer": 3,
    "explanation": "Independent, parallelizable work with a total footprint bigger than one context window is the canonical case for fan-out: one focused subagent per service, each returning a compact result the coordinator combines."
  },
  {
    "id": "Q62",
    "category": "code",
    "points": 50,
    "type": "multiple",
    "prompt": "You're building a headless Claude integration that runs unattended in a backend job, and you need to branch your control flow on the `stop_reason` field returned with every Messages API response so the job knows whether it's done, needs to continue, or must run a tool. A teammate wrote the branching logic from memory and you're reviewing it.\nWhich interpretation of the stop_reason values is correct?",
    "options": [
      "`end_turn` means the user must reply; `stop_sequence` means an error occurred; `tool_use` means a tool failed.",
      "All non-`end_turn` values indicate errors that should abort the loop.",
      "`end_turn` means Claude finished naturally; `max_tokens` means the output was cut off by the token limit; `tool_use` means Claude is requesting a tool call.",
      "`max_tokens` means the conversation exceeded the context window and must be summarized before continuing."
    ],
    "correctAnswer": 2,
    "explanation": "Each stop_reason signals why generation halted: end_turn = natural completion, max_tokens = hit the output cap (you may need to continue), tool_use = a tool was requested. They drive different loop behavior."
  },
  {
    "id": "Q7",
    "category": "research",
    "points": 50,
    "type": "multiple",
    "prompt": "The synthesis agent receives summarized findings from the web search and document analysis agents, then passes a consolidated summary to the report generator. During testing, you discover the generated reports make factual claims without proper citations—the report generator cannot attribute statements to their original sources because that metadata was lost during the summarization steps.\nWhat's the most effective approach to ensure proper source attribution in the final reports?",
    "options": [
      "Have each agent output structured data separating content summaries from source metadata (URLs, document names, page numbers).",
      "Have the report generator query the web search agent to re-locate sources for claims in the final report.",
      "Instruct the synthesis agent to embed source references inline within its summary text using a consistent citation format.",
      "Skip summarization and pass full raw outputs from web search and document analysis directly to the report generator."
    ],
    "correctAnswer": 0,
    "explanation": "Structured content + separate source metadata preserves the mapping end-to-end, so the report generator receives both what was said and where it came from."
  },
  {
    "id": "Q72",
    "category": "code",
    "points": 100,
    "type": "multiple",
    "prompt": "You have three CLAUDE.md files in play at once: a user-level `~/.claude/CLAUDE.md` saying \"always use tabs\", a project-level `CLAUDE.md` saying \"use 2-space indentation\", and a directory-level `CLAUDE.md` inside `src/legacy/` saying \"match the surrounding file's style\". You ask the agent to edit a file that lives in `src/legacy/`.\nWhich guidance takes precedence for that edit?",
    "options": [
      "The user-level file always wins because it loads first and establishes global defaults.",
      "The project-level file always wins because it's the canonical source for the repo.",
      "All three are concatenated with equal weight and the model picks arbitrarily.",
      "The most specific (directory-level) instruction wins for files under that directory, layering over the project and user guidance."
    ],
    "correctAnswer": 3,
    "explanation": "CLAUDE.md files compose from broad to narrow, and the nearest (most specific) scope takes precedence — a directory-level file overrides project- and user-level guidance for files in its subtree."
  },
  {
    "id": "Q40",
    "category": "support",
    "points": 50,
    "type": "multiple",
    "prompt": "A customer sends: \"This is frustrating. I've explained my issue twice and nothing is being resolved. I want to talk to a real person NOW.\" The agent has not yet called any tools to investigate their account.\nWhat should the agent do?",
    "options": [
      "Acknowledge the frustration and ask one targeted question to understand the specific issue before escalating.",
      "Briefly explain what the agent can help with and offer to resolve the issue quickly, escalating only if the customer repeats their request.",
      "Immediately call `escalate_to_human` with the conversation history.",
      "First call `get_customer` and `lookup_order` to gather account context, then escalate to a human agent."
    ],
    "correctAnswer": 0,
    "explanation": "The customer has said 'twice' but you have no context yet. One acknowledging, focused question gives you a shot at first-contact resolution without dismissing the frustration or delaying a potential handoff."
  },
  {
    "id": "Q78",
    "category": "code",
    "points": 50,
    "type": "multiple",
    "prompt": "A newly onboarded engineer finds themselves re-explaining the same project facts to the agent at the start of every single session: the build command, which test runner to use, and the repo's directory conventions. It's repetitive and error-prone.\nWhat's the intended way to make the agent remember these details persistently across sessions?",
    "options": [
      "Ask the agent to memorize them; it will retain them across sessions automatically.",
      "Put them in a comment at the top of one source file and hope the agent reads it.",
      "Record them in the project's `CLAUDE.md`, which is loaded into context automatically at the start of each session.",
      "Increase the context window so prior sessions stay loaded."
    ],
    "correctAnswer": 2,
    "explanation": "`CLAUDE.md` is the project's persistent memory: conventions, commands, and constraints placed there load into every session automatically, so you don't repeat them."
  },
  {
    "id": "Q30",
    "category": "code",
    "points": 200,
    "type": "multiple",
    "prompt": "An engineer who just joined the team asks the agent to help them understand the authentication and authorization architecture before making security improvements. The codebase has 800+ files across multiple services.\nWhat exploration strategy will most effectively build understanding, given Claude built-in tools and context limits?",
    "options": [
      "Read any CLAUDE.md and README files first, then ask the engineer to specify which 10-15 files are most important for understanding the auth system.",
      "Launch parallel subagents to explore different services simultaneously, then synthesize their findings into an architectural overview.",
      "Use Grep to find authentication entry points, read those files, then follow imports and function calls to map the auth flow incrementally.",
      "Read all files containing \"auth\", \"login\", \"permission\", or \"token\" in their content or filename."
    ],
    "correctAnswer": 2,
    "explanation": "Start at entry points (login, token verify, middleware), then trace outward following real code edges. Incremental, grounded, fits within context limits."
  },
  {
    "id": "Q82",
    "category": "extraction",
    "points": 50,
    "type": "multiple",
    "prompt": "Your extractor keeps formatting the same field inconsistently from one document to the next — sometimes \"Cotton/Poly\", sometimes \"cotton blend\", and occasionally omitting it entirely even when the material is clearly stated. You've already added explicit prompt instructions describing the desired format and it hasn't fixed the inconsistency.\nWhat's the most effective next step?",
    "options": [
      "Raise the model tier and hope instruction-following improves.",
      "Make the field required so it's never omitted.",
      "Add a few-shot examples showing the exact canonical format you expect for that field.",
      "Run three extractions and take the majority format."
    ],
    "correctAnswer": 2,
    "explanation": "Few-shot examples concretely demonstrate the target format, teaching the model the canonical representation and improving both consistency and recall on skipped fields."
  },
  {
    "id": "Q84",
    "category": "extraction",
    "points": 100,
    "type": "multiple",
    "prompt": "Your extraction service defines an `emit_record` tool and expects every response to be a call to it so a strict parser can consume the structured arguments. In production, though, the model occasionally responds with a chatty text explanation instead of invoking the tool, and each of those responses crashes the parser.\nHow do you guarantee the model always calls the tool?",
    "options": [
      "Add 'ALWAYS call the tool' in capital letters to the system prompt and rely on it.",
      "Parse the text reply as a fallback whenever the tool isn't called.",
      "Remove the tool and ask for JSON in prose instead.",
      "Set `tool_choice` to force the specific tool, so the model must return a call to `emit_record` rather than free text."
    ],
    "correctAnswer": 3,
    "explanation": "`tool_choice` set to a specific tool forces the model to invoke exactly that tool, eliminating the stray free-text responses that break a parser expecting structured output."
  },
  {
    "id": "Q74",
    "category": "code",
    "points": 50,
    "type": "multiple",
    "prompt": "An engineer is about to let the agent make sweeping edits across a critical, high-traffic service. Before a single file is touched, they want to see and approve the agent's intended approach — the files it plans to change and the strategy — so a mistake can be caught before any change lands.\nWhich Claude Code feature fits this need?",
    "options": [
      "Running with `--dangerously-skip-permissions` so the plan executes immediately.",
      "Lowering `max_tokens` so the agent produces only a short plan and no edits.",
      "Plan Mode, which has the agent research and propose a plan for approval before making any edits.",
      "Clearing context with `/clear` so the agent starts planning fresh."
    ],
    "correctAnswer": 2,
    "explanation": "Plan Mode is exactly this: the agent investigates and presents a plan for the human to approve before any changes are applied — a review gate for high-stakes work."
  },
  {
    "id": "Q91",
    "category": "support",
    "points": 50,
    "type": "multiple",
    "prompt": "Your `get_customer` tool returns its result as a single prose sentence, e.g. \"John, a gold member since 2019 with 2 open tickets.\" Your downstream logic tries to read the membership tier and open-ticket count out of that sentence, and it keeps mis-parsing both when the phrasing varies slightly.\nWhat's the better design for the tool's output?",
    "options": [
      "Return structured fields (e.g., `name`, `tier`, `memberSince`, `openTickets`) so the agent and downstream code read them unambiguously.",
      "Return an even longer, more descriptive sentence for clarity.",
      "Return the prose but also log the structured data server-side.",
      "Ask the model to reformat the prose into fields after each call."
    ],
    "correctAnswer": 0,
    "explanation": "Tools should return structured data, not prose, so both the model and downstream code can read individual fields reliably instead of parsing sentences."
  },
  {
    "id": "Q100",
    "category": "research",
    "points": 200,
    "type": "multiple",
    "prompt": "Your research agent occasionally states confident, definitive conclusions in its final reports that later turn out not to be supported by any of the sources it gathered. You want to raise reliability, but you don't want to smother every sentence in \"possibly\" and \"maybe\" and make the reports uselessly vague.\nWhat's the most effective addition?",
    "options": [
      "Instruct the agent to add 'possibly' or 'maybe' to every sentence.",
      "Only ever use a single source so there's nothing to reconcile.",
      "Raise temperature so the agent considers more possibilities.",
      "Add a verification pass that cross-checks each key claim against the gathered sources and flags any that lack support before the report is finalized."
    ],
    "correctAnswer": 3,
    "explanation": "A dedicated verification step that binds each claim back to its supporting source catches unsupported statements specifically, improving reliability without blanket hedging that would make the report vague."
  },
  {
    "id": "Q10",
    "category": "research",
    "points": 200,
    "type": "multiple",
    "prompt": "After the web search agent and document analysis agent complete their tasks, the coordinator invokes the synthesis agent. However, the synthesis agent responds that it cannot complete the task because no research findings were provided.\nWhat is the most likely cause of this issue?",
    "options": [
      "The synthesis agent's context window is not large enough to hold the combined outputs from both previous agents.",
      "The coordinator did not include the outputs from the previous agents in the synthesis agent's prompt.",
      "The subagents need to share a single API connection to enable automatic context sharing between invocations.",
      "The synthesis agent needs tools that can fetch results directly from the other agents' conversation histories."
    ],
    "correctAnswer": 1,
    "explanation": "Subagent invocations are isolated — nothing flows between them unless the coordinator explicitly puts it in the prompt. The message 'no findings provided' is exactly what you'd see."
  },
  {
    "id": "Q38",
    "category": "support",
    "points": 100,
    "type": "multiple",
    "prompt": "Production logs reveal inconsistent error handling: when `lookup_order` fails, the agent sometimes retries 5+ times (wasteful when the order ID doesn't exist), sometimes escalates immediately (premature for temporary network issues), and sometimes asks users for clarification (inappropriate when the issue is a backend permission error). Investigation shows your MCP tool returns uniform error responses: {\"isError\": true, \"content\": [{\"type\": \"text\", \"text\": \"Operation failed\"}]}. The agent cannot distinguish between error types.\nWhat's the most effective improvement?",
    "options": [
      "Enhance error responses with structured metadata: include errorCategory (transient/validation/permission), isRetryable boolean, and a description of what caused the failure.",
      "Create an `analyze_error` MCP tool the agent calls after any failure to determine the error category and recommended action.",
      "Implement retry logic with exponential backoff in your MCP server for all errors, returning to the agent only after retries are exhausted.",
      "Add few-shot examples to the system prompt demonstrating how to interpret error message patterns and select appropriate responses for each."
    ],
    "correctAnswer": 0,
    "explanation": "Give the agent the information it needs to make the right decision: category, retryability, and a human-readable cause. That replaces guessing with deterministic policy."
  },
  {
    "id": "Q3",
    "category": "research",
    "points": 150,
    "type": "multiple",
    "prompt": "The document analysis agent has a single `analyze_document` tool that takes a document and a free-text instruction parameter. During evaluation, requests like \"extract the key financial metrics\" often return narrative summaries, while \"summarize the methodology\" sometimes returns raw data tables. The synthesis agent reports that 35% of analysis results require re-requests with clarified instructions.\nWhat's the most effective way to improve reliability?",
    "options": [
      "Split the generic tool into purpose-specific tools—`extract_data_points`, `summarize_content`, `verify_claim_against_source`—each with defined input/output contracts.",
      "Keep the single tool but add an `analysis_type` enum parameter requiring explicit selection between extraction, summarization, and verification modes.",
      "Have the coordinator pre-classify each analysis request before passing instructions to the document analysis agent.",
      "Enhance the tool description with detailed examples showing how different instruction phrasings should map to different output formats."
    ],
    "correctAnswer": 0,
    "explanation": "Free-text instructions put the semantics in prose, which the model interprets inconsistently. Purpose-specific tools give the model an explicit, well-typed contract to pick between."
  },
  {
    "id": "Q20",
    "category": "code",
    "points": 150,
    "type": "multiple",
    "prompt": "Your agent has spent 25 minutes exploring a game engine's rendering subsystem—reading shader code, buffer management, and frame synchronization logic. An engineer now asks it to understand how the physics engine integrates with rendering for collision debug overlays. You notice recent responses reference \"typical rendering patterns\" rather than the specific VulkanPipeline and FrameGraph classes it discovered earlier.\nWhat's the most effective approach?",
    "options": [
      "Spawn a sub-agent to explore physics independently, then manually synthesize its findings with the rendering knowledge accumulated in the main conversation.",
      "Continue in the current context with more targeted prompts referencing the specific classes by name.",
      "Summarize key rendering findings, then spawn a sub-agent for physics exploration with that summary in its initial context.",
      "Use /clear to reset context completely, then start fresh with physics exploration using file paths from the project's CLAUDE.md."
    ],
    "correctAnswer": 2,
    "explanation": "Condense what you've learned about rendering into a compact summary, then give a fresh subagent that summary plus the physics task — you preserve the important signal and escape the degraded context."
  },
  {
    "id": "Q81",
    "category": "extraction",
    "points": 150,
    "type": "multiple",
    "prompt": "In production, about 6% of your extractions fail JSON-schema validation — wrong types, missing required fields, malformed enums. You want an automated recovery loop that resolves the large majority of these without a human in the loop.\nWhat's the standard pattern for this?",
    "options": [
      "Silently drop failing extractions to keep the success rate high.",
      "On validation failure, re-call the model with the specific validation error appended, letting it correct the output — usually fixed within a couple retries.",
      "Disable schema validation so nothing fails.",
      "Switch every field to a string so any output validates."
    ],
    "correctAnswer": 1,
    "explanation": "A validation-retry loop that feeds the concrete error back to the model resolves most format mistakes in 1–3 attempts, because the model can see exactly what to fix."
  },
  {
    "id": "Q77",
    "category": "code",
    "points": 150,
    "type": "multiple",
    "prompt": "Your team runs the same multi-step prompt dozens of times a day — \"run the linter, summarize the failures, then propose fixes\" — and everyone re-types or copy-pastes it each time. You want it to be invokable as a short, named, reusable command that the whole team shares in Claude Code.\nWhat's the intended mechanism?",
    "options": [
      "Paste the full prompt each time; there's no way to save reusable prompts.",
      "Define a custom slash command (a prompt template stored in `.claude/commands/`) that the whole team can invoke by name.",
      "Encode the steps into `CLAUDE.md` so they run automatically on every message.",
      "Create an MCP server whose only job is to hold the prompt text."
    ],
    "correctAnswer": 1,
    "explanation": "Repeated prompt workflows belong in custom slash commands — reusable templates in `.claude/commands/` that anyone on the team can invoke by name."
  },
  {
    "id": "Q99",
    "category": "support",
    "points": 50,
    "type": "multiple",
    "prompt": "To make a support agent \"know everything,\" an engineer pastes the entire 200-page knowledge base into the system prompt of every single request. After the change, responses got slower and, on some questions, actually less accurate than before.\nWhat's the better approach?",
    "options": [
      "Retrieve only the relevant KB passages per query (e.g., via search/tools) instead of loading the whole base every time.",
      "Paste the KB twice so the model doesn't miss anything.",
      "Keep the full KB but lower temperature to sharpen answers.",
      "Split the KB across multiple system messages in the same request."
    ],
    "correctAnswer": 0,
    "explanation": "The context window is finite and stuffing it degrades focus and speed. Retrieve just the passages relevant to each query rather than loading the entire knowledge base every time."
  },
  {
    "id": "Q96",
    "category": "research",
    "points": 150,
    "type": "multiple",
    "prompt": "A report-writing agent is handed 30 sources in a single prompt and asked to weave them together. In practice it reliably cites the first few and last few sources but consistently neglects the ones buried in the middle of that long context, leaving noticeable gaps in coverage.\nWhat's the most effective mitigation?",
    "options": [
      "Add all 30 sources again a second time to reinforce them.",
      "Increase temperature so the model samples the middle more.",
      "Tell the model 'read every source equally' and rely on it.",
      "Place the most important sources at the start and end of the context, and/or process the sources in smaller focused batches."
    ],
    "correctAnswer": 3,
    "explanation": "Models attend most strongly to the beginning and end of long contexts (the lost-in-the-middle effect). Positioning key material at the edges — or batching sources — counteracts the neglect."
  },
  {
    "id": "Q79",
    "category": "support",
    "points": 100,
    "type": "multiple",
    "prompt": "A hard security policy states that the agent must never, under any circumstances, edit files under the `secrets/` directory — and this has to hold no matter how the model is prompted, including adversarial or accidental instructions that might talk it into an edit.\nWhat's the most reliable way to enforce this in Claude Code?",
    "options": [
      "A PreToolUse hook that inspects Edit/Write calls and blocks any targeting `secrets/` before the tool runs.",
      "A strongly worded rule in `CLAUDE.md` forbidding edits to `secrets/`.",
      "A few-shot example in the system prompt showing the agent declining such edits.",
      "Removing the Edit tool entirely for the whole session."
    ],
    "correctAnswer": 0,
    "explanation": "Hard, non-negotiable policies belong outside model discretion. A PreToolUse hook deterministically intercepts and blocks the tool call every time, independent of prompting."
  },
  {
    "id": "Q49",
    "category": "extraction",
    "points": 100,
    "type": "multiple",
    "prompt": "Your extraction pipeline processes contracts that frequently include amendments. When a contract contains both original terms and later amendments (e.g., original clause specifies \"30-day payment terms\" while Amendment 1 changes this to \"45 days\"), the model inconsistently extracts one value or the other with no indication of which applies.\nWhat's the most effective approach to improve extraction accuracy for documents with amendments?",
    "options": [
      "Redesign the schema so amended fields capture multiple values, each with source location and effective date.",
      "Add prompt instructions to always extract the most recent amendment value and ignore superseded original terms.",
      "Preprocess documents with a classifier that identifies and removes superseded sections before the main extraction step.",
      "Implement post-extraction validation using pattern matching to detect amendments and flag those extractions for manual review."
    ],
    "correctAnswer": 0,
    "explanation": "Amendments are structurally about versioned values. A schema with value + source location + effective date models the domain correctly and stops forcing the model to pick one."
  },
  {
    "id": "Q42",
    "category": "support",
    "points": 200,
    "type": "multiple",
    "prompt": "A customer raises three separate issues during one session: a refund inquiry (turns 1-15), a subscription question (turns 16-30), and a payment method update (turns 31-45). At turn 48, the customer asks \"What happened with my refund?\" The conversation is approaching context limits.\nWhat strategy best maintains the agent's ability to address all issues throughout the session?",
    "options": [
      "Extract and persist structured issue data (order IDs, amounts, statuses) into a separate context layer.",
      "Rely on MCP tools to re-fetch relevant information on demand when the customer references earlier issues.",
      "Summarize earlier turns into a narrative description, preserving full message history only for the active issue.",
      "Implement sliding window context that retains the most recent 30 turns."
    ],
    "correctAnswer": 2,
    "explanation": "Progressive summarization compresses stable resolved topics while keeping the active thread verbatim — the classic pattern for long multi-issue conversations near the context limit."
  },
  {
    "id": "Q9",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "In production, final reports frequently contain claims without proper source attribution. Investigation shows that while the web search and document analysis agents correctly attach citations to their outputs, the synthesis agent loses track of which sources support which conclusions when combining findings.\nWhat's the most effective architectural change?",
    "options": [
      "Maintain complete transcripts of all subagent interactions and add a citation-resolution agent to analyze logs and determine attributions before report generation.",
      "Require all subagents to output structured claim-source mappings that the synthesis agent must preserve and merge when combining findings from multiple sources.",
      "Add a verification step where the report generator uses semantic similarity matching against original sources to reconstruct which claims came from which documents.",
      "Have the coordinator inject source identifier prefixes into text before each handoff, then parse these prefixes at report generation to reconstruct citations."
    ],
    "correctAnswer": 1,
    "explanation": "Explicit claim-source mappings are a first-class output the synthesis agent can merge deterministically — no attribution gets dropped during summarization."
  },
  {
    "id": "Q25",
    "category": "code",
    "points": 100,
    "type": "multiple",
    "prompt": "A developer asks the agent to investigate why a specific API endpoint intermittently returns 500 errors. The codebase has 200+ files and the developer doesn't know which components are involved. The agent must trace the error through routing, middleware, business logic, and database layers.\nWhat task decomposition approach would be most effective?",
    "options": [
      "Have the agent first create a comprehensive plan mapping all code paths through the endpoint before beginning any file exploration or code reading.",
      "Have the agent dynamically generate investigation subtasks based on what it discovers at each step, adapting its exploration plan as new information about the error path emerges.",
      "Define a fixed sequence of investigation steps upfront—grep for error patterns, then read error handlers, then check database queries, then examine middleware—executing each step regardless of intermediate findings.",
      "Run parallel worker agents that simultaneously investigate all four layers, then synthesize their findings to identify where the error originates."
    ],
    "correctAnswer": 1,
    "explanation": "Debugging is adaptive by nature — each file you read changes the most useful next step. Let the agent follow the evidence."
  },
  {
    "id": "Q93",
    "category": "support",
    "points": 150,
    "type": "multiple",
    "prompt": "An agent has two billing-related tools, `refund_order` and `cancel_subscription`, and for billing complaints it sometimes fires the wrong one. Both tool descriptions are terse — \"handles refunds\" and \"handles cancellations\" — with nothing about when one applies versus the other.\nWhat's the most effective fix?",
    "options": [
      "Merge the two tools into one `billing_action` tool with a mode flag.",
      "Rewrite each description to clearly state when to use it and when not to, including the distinguishing conditions.",
      "Remove one of the tools during billing conversations.",
      "Add few-shot dialogues for every billing phrasing you can think of."
    ],
    "correctAnswer": 1,
    "explanation": "Tool selection is driven by descriptions. Spelling out when each tool applies (and when it doesn't) is the most direct, scalable way to stop the model from confusing overlapping tools."
  },
  {
    "id": "Q66",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "A coordinator is asked to investigate why a key business metric regressed overnight. The data flows through three stages — ingestion, transformation, and reporting — and nobody knows in advance which stage introduced the regression; the cause could be in any one of them, or a combination.\nWhich task-decomposition strategy fits this investigation best?",
    "options": [
      "Fix a rigid sequence — check ingestion, then transformation, then reporting — and run all three regardless of intermediate findings.",
      "Produce a complete, exhaustive plan of every possible code path before reading anything.",
      "Let the coordinator generate the next investigation subtask dynamically based on what each step reveals, adapting the plan as evidence accumulates.",
      "Spawn all three investigations in parallel every time and always synthesize all outputs, even when the first already found the cause."
    ],
    "correctAnswer": 2,
    "explanation": "Diagnostic work is inherently adaptive — each finding changes the most useful next step. Dynamic decomposition follows the evidence instead of committing to a fixed or fully-parallel plan up front."
  },
  {
    "id": "Q73",
    "category": "code",
    "points": 150,
    "type": "multiple",
    "prompt": "You want a coding rule that applies only to test files and stays out of the way everywhere else. You add a rule file under `.claude/rules/` with YAML frontmatter, intending it to activate exclusively for paths matching `**/*.test.ts`.\nWhich mechanism correctly scopes the rule to just those files?",
    "options": [
      "Placing the rule file physically inside every test directory.",
      "A glob pattern in the rule file's frontmatter that matches the target paths, so the rule activates only when relevant files are in play.",
      "A conditional written in the rule body that the model evaluates at runtime for each file.",
      "Naming the rule file `test.ts` so Claude Code matches it by filename."
    ],
    "correctAnswer": 1,
    "explanation": "Rules under `.claude/rules/` use frontmatter (including glob scoping) to declare when they apply, so a rule can target `**/*.test.ts` and stay dormant elsewhere."
  },
  {
    "id": "Q63",
    "category": "research",
    "points": 150,
    "type": "multiple",
    "prompt": "Your research coordinator orchestrates two specialized subagents. The web-search subagent runs first and returns eight relevant sources, which appear in the coordinator's own conversation. The coordinator then spawns a document-analysis subagent to examine those sources, but it replies that it has no sources to analyze — even though, from the coordinator's point of view, the sources were clearly gathered moments earlier.\nWhat underlying rule are you violating?",
    "options": [
      "Subagents don't inherit the parent's conversation context; the coordinator must pass the needed sources explicitly in the subagent's prompt.",
      "Subagents share the parent context automatically, so the search results were lost to a race condition between the two subagents.",
      "Subagents can read the parent's context only if they use the same model tier as the coordinator.",
      "Subagents inherit context, but `tool_result` blocks are stripped, so only the search agent's prose survived."
    ],
    "correctAnswer": 0,
    "explanation": "Each subagent starts with a fresh, isolated context. Nothing from the parent (or sibling subagents) reaches it unless the coordinator puts it into that subagent's prompt."
  },
  {
    "id": "Q35",
    "category": "support",
    "points": 200,
    "type": "multiple",
    "prompt": "During a billing dispute resolution, your agent successfully retrieves customer info via `get_customer` and order details via `lookup_order`, but when attempting to call `process_refund`, the tool returns a timeout error. The agent has enough information to explain the charges and verify refund eligibility, but cannot actually process the refund due to the backend failure.\nWhat approach best balances first-contact resolution with appropriate error handling?",
    "options": [
      "Escalate immediately to a human agent since the refund action cannot be completed",
      "Implement automatic retries with exponential backoff for `process_refund`, keeping the conversation open until the refund is successfully processed",
      "Explain the billing, confirm refund eligibility, acknowledge the system issue preventing immediate processing, and offer escalation or retry later",
      "Confirm the refund will be processed and close the conversation, since the system has all necessary information to complete it automatically"
    ],
    "correctAnswer": 2,
    "explanation": "Deliver the partial value you can (explanation + eligibility), be honest about the failure, and let the customer choose between human escalation or a retry. Classic graceful degradation."
  },
  {
    "id": "Q24",
    "category": "code",
    "points": 50,
    "type": "multiple",
    "prompt": "An engineer asks your agent to identify untested code paths in a legacy payment processing module spanning 45 files. After reading the first 8 source files, the agent's responses are becoming noticeably less accurate—it's forgetting previously discussed code patterns and hasn't yet located all test files or traced critical payment flows.\nWhat's the most effective approach to complete this investigation?",
    "options": [
      "Document all current findings in a summary report, clear context completely, then use that report as the sole reference for continuing the investigation.",
      "Spawn subagents to investigate specific questions (e.g., \"find all test files for payment processing\", \"trace refund flow dependencies\") while the main agent coordinates findings and preserves high-level understanding.",
      "Clear context with /clear, then selectively re-read only the most critical files discovered so far, writing key findings to a scratchpad file that persists between context resets.",
      "Switch to using Grep to search for specific function names instead of reading full files, reducing the content loaded into context for remaining exploration."
    ],
    "correctAnswer": 1,
    "explanation": "Delegate well-scoped investigations to subagents with fresh context, while the main agent keeps the architectural overview. This is the pattern for scaling exploration beyond a single context window."
  },
  {
    "id": "Q23",
    "category": "code",
    "points": 100,
    "type": "multiple",
    "prompt": "An engineer asks the agent to understand how the caching layer works before adding a new cache invalidation trigger. After initial Grep searches, the agent has identified that caching logic spans 15 files including decorators, middleware, and service classes (~8,000 lines total).\nWhat's the most effective next step for building understanding while managing context constraints?",
    "options": [
      "Use the Read tool to sequentially load all 15 files, building complete understanding across the full caching implementation.",
      "Analyze imports and class hierarchies to identify the base cache class, Read that file to understand the interface, then trace specific invalidation implementations.",
      "Use Grep to search for \"invalidate\" and \"expire\" patterns across all files, then Read only those specific line ranges with minimal surrounding context.",
      "Use Glob to find files matching common caching patterns (cache.py, caching/), prioritize the largest files by reading them first, then check smaller files for gaps."
    ],
    "correctAnswer": 1,
    "explanation": "Start from the architectural root (the interface), then navigate only the specific implementations that matter for invalidation — focused reading, low context cost."
  },
  {
    "id": "Q16",
    "category": "code",
    "points": 200,
    "type": "multiple",
    "prompt": "After integrating a local MCP server providing code analysis tools (`analyze_dependencies`, `find_dead_code`, `calculate_complexity`), you verify the server is healthy and tools appear in the tools/list response. However, you observe that the agent consistently uses Grep to search for import statements instead of calling `analyze_dependencies`—even when users explicitly ask about \"code dependencies.\" Examining tool definitions reveals:\nMCP: `analyze_dependencies` - \"Analyzes dependency graph\"\nBuilt-in: Grep - \"Search file contents for a pattern using regular expressions. Returns matching lines with line numbers and surrounding context.\"\nWhat's the most effective approach to improve the agent's selection of MCP tools?",
    "options": [
      "Remove Grep from available tools when the MCP server is connected to eliminate functional overlap.",
      "Add routing instructions to the system prompt specifying that dependency-related questions should use MCP tools rather than Grep.",
      "Split `analyze_dependencies` into granular tools (`list_imports`, `resolve_transitive_deps`, `detect_circular_deps`) so each has a focused purpose less likely to overlap with Grep.",
      "Expand MCP tool descriptions to detail capabilities and outputs—e.g., \"Builds dependency graph showing direct imports, transitive dependencies, and cycles.\""
    ],
    "correctAnswer": 3,
    "explanation": "Tool selection is driven by the descriptions the model sees. A one-line description like 'Analyzes dependency graph' loses against Grep's rich description. Beef up the MCP tool's description."
  },
  {
    "id": "Q57",
    "category": "extraction",
    "points": 150,
    "type": "multiple",
    "prompt": "Your extraction system parses e-commerce product descriptions to extract specifications like dimensions, weight, and materials into JSON. Despite having a well-defined schema, the model inconsistently extracts the \"materials\" field—sometimes returning \"cotton blend\", other times \"Cotton/Polyester mix\", and occasionally omitting the field when material information is clearly present in the source.\nWhat's the most effective way to improve extraction consistency?",
    "options": [
      "Make the \"materials\" field required instead of optional in the schema to force the model to always extract a value",
      "Switch to a more capable model tier since inconsistent extraction indicates insufficient model capability",
      "Set temperature to 0 to eliminate randomness and ensure deterministic outputs",
      "Add few-shot examples showing 2-3 complete input-output pairs with standardized material description formats"
    ],
    "correctAnswer": 3,
    "explanation": "Few-shot examples demonstrate the exact canonical format you want ('cotton/polyester' as a normalized list), and they also raise recall on material info that was being skipped."
  },
  {
    "id": "Q11",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "A user is expanding the research system beyond its single web search agent by adding specialized data sources. They add a financial API agent that returns structured JSON with revenue, margins, and growth rates; a news monitoring agent that returns prose summaries of recent developments; and a patent analysis agent that returns structured lists of technology areas. The synthesis agent combines these into executive briefings. Currently, it converts everything to bullet points, causing financial comparisons to lose tabular clarity and news summaries to lose narrative flow.\nWhat change would most improve briefing quality?",
    "options": [
      "Standardize all subagent outputs to prose summaries with inline citations.",
      "Add a format conversion layer between subagents and synthesis that transforms all outputs to a common intermediate representation.",
      "Update the synthesis agent to render each content type appropriately—financial data as tables, news as prose.",
      "Standardize all subagent outputs to JSON with fields for claim, evidence, source, and confidence."
    ],
    "correctAnswer": 2,
    "explanation": "Executive briefings need mixed rendering: tables for numbers, prose for narrative. Asking synthesis to preserve the native format of each input is the right abstraction."
  },
  {
    "id": "Q88",
    "category": "support",
    "points": 100,
    "type": "multiple",
    "prompt": "You're tuning how a support agent uses tools. In the general conversational flow (greetings, small talk) you want the model to decide on its own whether any tool is even needed. But you also have a separate, dedicated flow where calling one specific tool is mandatory and non-negotiable.\nWhich combination of `tool_choice` settings matches these two flows?",
    "options": [
      "Use `any` everywhere so the model always calls some tool, including on greetings.",
      "Omit `tool_choice` entirely; it has no effect on behavior.",
      "Use `auto` for the mandatory flow and `none` for the general one.",
      "Use `auto` for the general flow (model decides) and force the specific tool where a call is mandatory."
    ],
    "correctAnswer": 3,
    "explanation": "`auto` lets the model choose whether to call a tool (right for greetings), while forcing a specific tool guarantees a call where it's mandatory. `any` would wrongly force a tool even on a plain greeting."
  },
  {
    "id": "Q37",
    "category": "support",
    "points": 50,
    "type": "multiple",
    "prompt": "The agent verifies customer identity through a multi-step process before resetting passwords. During testing, you notice that after the customer answers the third verification question, the agent asks them to provide their name again, as if the earlier exchange never happened.\nWhat's the most likely cause of this behavior?",
    "options": [
      "The verification tool is clearing the agent's internal state after each successful validation step.",
      "The prompt lacks instructions telling Claude to remember information across multiple exchanges.",
      "The conversation history isn't being passed in subsequent API requests.",
      "Claude's memory retention is limited to two conversational turns by default, requiring explicit configuration to extend it."
    ],
    "correctAnswer": 2,
    "explanation": "The API is stateless. Each request must include the full messages array. If you only send the latest turn, the model has no memory of earlier ones — exactly the 'ask for the name again' symptom."
  },
  {
    "id": "Q56",
    "category": "extraction",
    "points": 100,
    "type": "multiple",
    "prompt": "Your extraction uses tool use with a JSON schema where `property_type` is defined as an enum: ['house', 'apartment', 'condo', 'townhouse']. After deployment, 8% of extractions fail schema validation. Investigation reveals listings mention many uncommon property types—\"studio\", \"loft\", \"duplex\", \"mobile home\", \"tiny house\", \"converted warehouse\"—and new types continue appearing regularly.\nWhat's the most effective long-term solution?",
    "options": [
      "Continuously expand the enum to include newly observed property types and add monitoring for additional edge cases.",
      "Add an \"other\" value to your enum with a separate `property_type_detail` string field for specifics when \"other\" is selected.",
      "Change `property_type` from an enum to a free-form string and implement a normalization step in post-processing.",
      "Add few-shot examples to your prompt demonstrating how to map unexpected property types to the closest existing enum value."
    ],
    "correctAnswer": 1,
    "explanation": "Keeps the strong enum for the common cases (clean downstream joins) while giving a well-typed escape hatch that preserves detail. Stable long-term."
  },
  {
    "id": "Q1",
    "category": "research",
    "points": 150,
    "type": "multiple",
    "prompt": "Your multi-agent research pipeline crashed after processing 12 of 28 documents. The web search agent had identified relevant sources, the document analysis agent had partially completed extraction, and the synthesizer had begun pattern identification.\nYou need to resume processing without repeating work or losing fidelity of prior findings.\nWhat state management approach best balances information fidelity with context efficiency when restoring agent state?",
    "options": [
      "Have each agent maintain its own persistent state file and reload it independently at the start of each session.",
      "Persist the coordinator's conversation log containing all task delegations and responses, providing this to agents when resuming.",
      "Have each agent persist a structured report to a known location. On resume, the coordinator loads the reports and injects relevant state into agent prompts.",
      "Index all agent outputs in a shared vector store. When resuming, each agent queries the store using semantic search to retrieve relevant prior findings."
    ],
    "correctAnswer": 2,
    "explanation": "Structured per-agent reports keep fidelity (the findings, with schema), let the coordinator stay in charge of orchestration, and keep each subagent's context focused. This is the orchestrator + compact artifact pattern."
  },
  {
    "id": "Q53",
    "category": "extraction",
    "points": 150,
    "type": "multiple",
    "prompt": "After implementing tool use with strict schema definitions, JSON syntax errors are eliminated, but 5% of extractions still have valid JSON with empty arrays or null values for required fields like citations and methodology. Spot-checking reveals that source documents contain this information, but in varied formats—inline citations vs. bibliographies, methodology sections vs. details embedded in introductions.\nWhat's the most effective way to address these failures?",
    "options": [
      "Implement retry logic that re-sends requests when validation detects empty required fields.",
      "Build a regex-based post-processing layer that scans source documents for citation patterns and methodology keywords, populating empty fields when the model fails to extract.",
      "Modify your schema to make citations and methodology optional, and flag incomplete records for manual review rather than failing validation.",
      "Add few-shot examples demonstrating extractions from documents with varied structures—showing how to identify citations in different formats and locate methodology details across section types."
    ],
    "correctAnswer": 3,
    "explanation": "The failure mode is the model not recognizing varied formats. Concrete examples across the format distribution directly raise recall on the 5%."
  },
  {
    "id": "Q39",
    "category": "support",
    "points": 50,
    "type": "multiple",
    "prompt": "When the agent calls `lookup_order` and receives order details showing the item was purchased 45 days ago, how does the agentic loop determine whether to call `process_refund` or `escalate_to_human` next?",
    "options": [
      "The orchestration layer automatically routes to the next tool based on the order's status field.",
      "The agent follows a pre-configured decision tree mapping order attributes to specific tool calls.",
      "The order details are added to the conversation and the model reasons about which action to take.",
      "The agent executes the remaining steps in a tool sequence planned at the start of the request."
    ],
    "correctAnswer": 2,
    "explanation": "The agentic loop works by appending `tool_result` messages to the conversation and letting the model decide the next step on each turn. That's how 45 days → refund vs. escalate gets resolved."
  },
  {
    "id": "Q85",
    "category": "extraction",
    "points": 150,
    "type": "multiple",
    "prompt": "You're extracting fields from regulatory filings where an error can have compliance consequences, so single-pass accuracy isn't good enough. You do, however, have budget for additional model calls per document.\nWhich technique most improves reliability on these high-stakes extractions?",
    "options": [
      "Increase `max_tokens` so the single pass has more room.",
      "Run a second pass where the model reviews its own extraction against the source and flags/corrects discrepancies.",
      "Extract twice at temperature 0 and keep the first result.",
      "Shorten the schema so there's less to get wrong."
    ],
    "correctAnswer": 1,
    "explanation": "A multi-pass review — where a second call verifies the extraction against the source — catches errors the first pass missed, trading extra cost for materially higher reliability on critical documents."
  },
  {
    "id": "Q46",
    "category": "extraction",
    "points": 150,
    "type": "multiple",
    "prompt": "Your extraction system processes two document types: standard monthly reports (archived after processing) and urgent exception reports (must trigger business alerts within 30 minutes of receipt). Both use the same JSON schema. You want to minimize API costs while meeting latency requirements.\nHow should you architect the processing pipeline?",
    "options": [
      "Submit all documents to the real-time Messages API to ensure consistent processing latency across document types.",
      "Submit all documents to the `Batch API` with `custom_ids` for tracking. When results arrive, immediately process urgent documents and trigger delayed alerts for exceptions.",
      "Queue all documents and submit hourly batches, flagging urgent documents for expedited handling when batch results return.",
      "Route standard reports to the `Batch API` for 50% cost savings, and route urgent exception reports to the real-time Messages API."
    ],
    "correctAnswer": 3,
    "explanation": "Match latency profile to document urgency: batch for the bulk (cheap), real-time for the latency-sensitive exceptions (fast). Minimizes cost while meeting SLA."
  },
  {
    "id": "Q36",
    "category": "support",
    "points": 50,
    "type": "multiple",
    "prompt": "A customer writes: \"I've been going back and forth on this return for days. I just want to speak to someone who can actually help me.\" The agent has confirmed via `lookup_order` that the return is straightforward—within policy and eligible for immediate processing.\nWhat should the agent do?",
    "options": [
      "Acknowledge frustration, inform them this is resolvable now, and offer to complete it or escalate",
      "Call `escalate_to_human` immediately to honor the customer's request",
      "Process the refund via `process_refund` to resolve the underlying issue, then inform them it's complete",
      "Ask what specifically hasn't worked in previous attempts before deciding whether to escalate or resolve automatically"
    ],
    "correctAnswer": 0,
    "explanation": "Honor the feeling, give them the fast resolution path in writing, and preserve their choice. That's the customer-respect move that still leverages the agent's capability."
  },
  {
    "id": "Q75",
    "category": "code",
    "points": 200,
    "type": "multiple",
    "prompt": "You're wiring Claude Code into your CI pipeline to automatically review pull requests on every push. The step has to run fully non-interactively (no TTY), and it must emit machine-readable output that a downstream script can parse to post review comments back onto the PR.\nWhich invocation is appropriate?",
    "options": [
      "Run headless with `-p` for a single prompt and `--output-format json` so the pipeline can parse structured results, with each run isolated.",
      "Launch the interactive TUI and script keystrokes to drive the review.",
      "Run `-p` but scrape the human-formatted terminal text with regex to extract findings.",
      "Start a long-lived session shared across all PRs so context accumulates between reviews."
    ],
    "correctAnswer": 0,
    "explanation": "For automation you use headless mode (`-p`) with `--output-format json` for parseable output, and keep each CI run session-isolated so reviews don't leak state into one another."
  },
  {
    "id": "Q83",
    "category": "extraction",
    "points": 200,
    "type": "multiple",
    "prompt": "Documents arrive steadily throughout the business day and each must be run through your extraction model. The results, however, are only needed by the next morning — there is no real-time requirement. Volume is high and you're under pressure to minimize the model cost of this pipeline.\nWhich API choice fits, and why?",
    "options": [
      "The Message Batches API, which offers ~50% lower cost with an asynchronous processing window that comfortably fits an overnight SLA.",
      "The real-time Messages API, because batching can't guarantee results by morning.",
      "The real-time API with temperature 0 to reduce token usage.",
      "The Batches API only if every document is identical, otherwise real-time."
    ],
    "correctAnswer": 0,
    "explanation": "Latency-tolerant, high-volume workloads are the Batches API's sweet spot: ~50% cheaper with an async window (up to 24h) that easily meets an overnight deadline."
  },
  {
    "id": "Q34",
    "category": "support",
    "points": 200,
    "type": "multiple",
    "prompt": "Compliance requires that refunds exceeding $500 must automatically escalate to a human agent—this rule cannot be left to model discretion. Despite clear system prompt instructions, production logs show the agent occasionally processes high-value refunds directly (3% failure rate).\nHow should you achieve guaranteed compliance?",
    "options": [
      "Modify the refund tool to return an error with message \"Amount exceeds policy limit—please escalate\" when threshold is exceeded.",
      "Add few-shot examples to the prompt showing correct escalation behavior at various refund amounts ($400, $500, $600).",
      "Implement a hook to intercept tool calls; when the refund process amount exceeds $500, block it and invoke human escalation.",
      "Strengthen the system prompt with emphatic language: \"CRITICAL POLICY: Refunds over $500 MUST trigger human escalation. NEVER process these directly.\""
    ],
    "correctAnswer": 2,
    "explanation": "Compliance-grade rules belong outside the model — a deterministic hook on the tool call is guaranteed to fire every time, independent of model behavior."
  },
  {
    "id": "Q87",
    "category": "extraction",
    "points": 100,
    "type": "multiple",
    "prompt": "You must extract specific clauses from contracts that routinely run far longer than what a single request can process comfortably — some are hundreds of pages. You still need every relevant clause, with the exact wording preserved and traceable back to where it appeared.\nWhat's the most reliable extraction strategy?",
    "options": [
      "Split the document into sections, extract from each, then merge results — keeping track of which section each value came from.",
      "Truncate each contract to its first pages and extract only from those.",
      "Paste the entire contract regardless of size and let the model decide what to keep.",
      "Summarize the contract first, then extract clauses from the summary."
    ],
    "correctAnswer": 0,
    "explanation": "For documents that exceed a comfortable request size, chunk by section, extract per chunk, and merge with source provenance — you preserve coverage without losing traceability. Summarizing first would drop the exact clause text you need."
  },
  {
    "id": "Q6",
    "category": "research",
    "points": 100,
    "type": "multiple",
    "prompt": "When researching \"renewable energy adoption,\" the web search agent returns recent statistics (2024: 35% adoption) while the document analysis agent extracts data from internal reports (2022: 18% adoption). The synthesis agent incorrectly flags these as contradictory sources rather than recognizing the data shows growth over time.\nWhat change would best enable the synthesis agent to correctly interpret such temporal differences?",
    "options": [
      "Require subagents to include publication or data collection dates in their structured outputs.",
      "Add a conflict resolution agent that automatically discards older data when newer data exists for the same metric.",
      "Configure the web search agent to only return results from the past 6 months.",
      "Instruct the synthesis agent to always treat the most recent data as authoritative and place older findings in a separate historical appendix."
    ],
    "correctAnswer": 0,
    "explanation": "The synthesis agent misreads the data because it never sees the dates. Making each data point carry its own timestamp in the structured output lets synthesis reason about trends instead of contradictions."
  },
  {
    "id": "Q89",
    "category": "code",
    "points": 150,
    "type": "multiple",
    "prompt": "Your developer-tools MCP server exposes a single, general `code_op` tool that takes a free-text `instruction` parameter. Results are inconsistent: \"find callers\" sometimes comes back as edits, while \"rename this symbol\" sometimes comes back as a written report instead of an actual change.\nWhich design change most improves reliability?",
    "options": [
      "Keep the single tool but write a longer description with more examples of instructions.",
      "Split it into purpose-specific tools (`find_callers`, `rename_symbol`, `extract_function`), each with a defined input/output contract.",
      "Add a pre-classifier that rewrites the instruction before the tool runs.",
      "Lower the temperature so the free-text instruction is interpreted deterministically."
    ],
    "correctAnswer": 1,
    "explanation": "Free-text instructions push semantics into prose the model interprets inconsistently. Purpose-specific tools give explicit, well-typed contracts, so the model picks the right operation reliably."
  },
  {
    "id": "Q71",
    "category": "research",
    "points": 50,
    "type": "multiple",
    "prompt": "You've built an orchestrator-worker research system in which each subagent runs in its own isolated context and cannot see any other subagent's conversation. Midway through, the synthesis subagent needs a specific figure that the search subagent discovered earlier.\nHow does that figure reach the synthesis subagent?",
    "options": [
      "The coordinator takes the search subagent's output and includes the figure in the synthesis subagent's prompt.",
      "The two subagents open a direct channel and pass the figure between themselves.",
      "Both subagents read from a shared context that the framework syncs automatically.",
      "The synthesis subagent calls the search subagent as a nested tool to retrieve it."
    ],
    "correctAnswer": 0,
    "explanation": "Subagents are isolated; the coordinator is the only hub. It forwards each worker's relevant output into the next worker's prompt."
  },
  {
    "id": "Q14",
    "category": "research",
    "points": 150,
    "type": "multiple",
    "prompt": "When analyzing complex legal cases that cite multiple precedents, the document analysis subagent processes each sequentially. A landmark case citing 12 precedents takes over 3 minutes to analyze completely.\nWhat's the most effective way to reduce this latency while preserving the coordinator's ability to monitor and debug the system?",
    "options": [
      "Implement a message queue where precedent analysis tasks are processed asynchronously by a pool of worker agents.",
      "Create a recursive agent hierarchy where analysis agents subdivide work among child agents until reaching single-precedent granularity.",
      "Have the coordinator spawn parallel document analysis subagents, each handling a subset of precedents, then aggregate results before synthesis.",
      "Enable the document analysis subagent to spawn its own specialized subagents dynamically when it encounters cases with many citations."
    ],
    "correctAnswer": 2,
    "explanation": "Coordinator-managed parallelism fans out the work, keeps each subagent's scope tight, and preserves a single hub for monitoring and aggregation."
  },
  {
    "id": "Q18",
    "category": "code",
    "points": 100,
    "type": "multiple",
    "prompt": "During testing, you observe that in extended exploration sessions (30+ minutes), the agent starts giving inconsistent answers about code structure it discussed earlier. Engineers report having to repeat context about modules they've already explored.\nWhat's the most effective approach to address this?",
    "options": [
      "Have the agent maintain a scratchpad file that records key findings, referencing it for subsequent questions.",
      "Switch to a higher-capacity model tier to provide more context window space for accumulated exploration data.",
      "Implement automatic context clearing every 15 minutes to ensure the agent starts with fresh, uncontaminated context.",
      "Create summaries of all source files before exploration begins, loading only these compressed representations into context."
    ],
    "correctAnswer": 0,
    "explanation": "A scratchpad offloads findings to durable storage the agent can re-read on demand, giving it a stable 'memory' independent of how crowded the context window gets."
  }
]

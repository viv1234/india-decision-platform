export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "Content-Type"
      }
    });
  }

  try {
    const request = context.request;
    const env = context.env;
    let body = {};
    if (request.method === "POST") {
      try { body = await request.json(); } catch (e) {}
    }
    const userQuery = body.userQuery || "";

    const apiKey = env.ANTHROPIC_API_KEY || env.AI_API_KEY || "";

    // 1. Natural Language Parameter Extraction
    const extractedParameters = extractParametersFromQuery(userQuery);

    // 2. RAG Knowledge Context
    const ragContext = retrieveRagContext(userQuery);

    // 3. Perform Anthropic Claude API Call if Key is configured
    let explanation = "";
    if (apiKey && apiKey.length > 10) {
      try {
        explanation = await callAnthropicApi(userQuery, ragContext, apiKey);
      } catch (err) {
        console.error("Cloudflare Anthropic API error:", err);
      }
    }

    if (!explanation) {
      explanation = `Goal Parsed: "${userQuery}". Based on Indian personal finance guidelines, keep loan EMIs under 30% of gross income and rent under 30%.`;
    }

    // 4. Return Full API Response
    const responseData = {
      intentCode: extractedParameters.intentCode || "CAR_AFFORDABILITY",
      recommendedCalculatorId: extractedParameters.recommendedCalculatorId || "emi",
      calculatorName: extractedParameters.calculatorName || "EMI Calculator",
      requiredInputs: ["principal", "annualInterestRate", "tenureValue"],
      explanation: explanation,
      retrievedContext: ragContext,
      calculationResult: extractedParameters.calculationResult || null,
      extractedParameters: extractedParameters.params || {}
    };

    return new Response(JSON.stringify({
      success: true,
      message: "AI decision orchestration complete (Cloudflare Edge Worker)",
      code: "SUCCESS",
      data: responseData,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "Content-Type"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to process request: " + error.message,
      code: "INTERNAL_ERROR"
    }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "Content-Type"
    }
  });
}

function retrieveRagContext(query) {
  const q = query.toLowerCase();
  const docs = [];
  if (q.includes("car") || q.includes("vehicle") || q.includes("afford")) {
    docs.push("[Car Purchase 20-4-10 Rule]: Minimum 20% down payment, loan tenure max 4 years, total vehicle costs (EMI + fuel) <= 10% of gross income.");
  }
  if (q.includes("rent") || q.includes("flat") || q.includes("house")) {
    docs.push("[30% Rent Budget Rule]: Monthly rent should not exceed 30% of net monthly in-hand salary.");
  }
  if (q.includes("sip") || q.includes("invest")) {
    docs.push("[50-30-20 Rule]: Allocate 50% for needs, 30% for wants, and minimum 20% for monthly SIP investments.");
  }
  if (docs.length === 0) {
    docs.push("[General Financial Rule]: Ensure EMIs and fixed liabilities do not exceed 40% of net monthly income.");
  }
  return docs;
}

function extractParametersFromQuery(query) {
  const q = query.toLowerCase();
  const result = {
    intentCode: "GENERAL_QUERY",
    recommendedCalculatorId: "emi",
    calculatorName: "EMI Calculator",
    params: {}
  };

  // Extract Lakhs
  const lakhMatches = [...query.matchAll(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l)\b/gi)];
  const lakhs = lakhMatches.map(m => parseFloat(m[1]) * 100000);

  // Extract Thousands
  const kMatches = [...query.matchAll(/(\d+(?:\.\d+)?)\s*(?:k|thousand|thousands)\b/gi)];
  const thousands = kMatches.map(m => parseFloat(m[1]) * 1000);

  // Extract Years
  const yrMatch = query.match(/(\d+)\s*(?:years|year|yr|yrs)\b/i);
  if (yrMatch) {
    result.params.tenureValue = parseInt(yrMatch[1], 10);
  }

  if (q.includes("car") || q.includes("vehicle")) {
    result.intentCode = "CAR_AFFORDABILITY";
    result.recommendedCalculatorId = "emi";
    result.calculatorName = "EMI Calculator";
    if (lakhs.length >= 2) {
      result.params.monthlyIncome = lakhs[0];
      result.params.principal = lakhs[1];
      result.params.carPrice = lakhs[1];
    } else if (lakhs.length === 1) {
      result.params.principal = lakhs[0];
      result.params.carPrice = lakhs[0];
    }
    result.params.annualInterestRate = 8.5;
  } else if (q.includes("rent") || q.includes("house")) {
    result.intentCode = "RENT_AFFORDABILITY";
    result.recommendedCalculatorId = "rent-affordability";
    result.calculatorName = "Rent Affordability Calculator";
    if (lakhs.length >= 1) result.params.monthlyIncome = lakhs[0];
    if (thousands.length >= 1) result.params.monthlyRent = thousands[0];
  } else if (q.includes("salary") || q.includes("ctc")) {
    result.intentCode = "SALARY_INHAND";
    result.recommendedCalculatorId = "salary";
    result.calculatorName = "Salary / CTC Calculator";
    if (lakhs.length >= 1) result.params.annualCtc = lakhs[0];
  } else if (q.includes("sip") || q.includes("invest")) {
    result.intentCode = "SIP_GROWTH";
    result.recommendedCalculatorId = "sip";
    result.calculatorName = "SIP Calculator";
    if (thousands.length >= 1) result.params.monthlyInvestment = thousands[0];
  }

  return result;
}

async function callAnthropicApi(userQuery, ragContext, apiKey) {
  const systemPrompt = "You are BharatDecision AI Assistant, an expert Indian personal finance and decision advisor. Provide concise, clear advice (2-3 sentences max) based on the retrieved context guidelines and recommend using the specified calculator.";
  const userContent = `User Query: ${userQuery}\n\nRetrieved Context:\n${ragContext.join("\n")}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey.trim(),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 350,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }]
    })
  });

  if (response.ok) {
    const data = await response.json();
    if (data.content && data.content.length > 0) {
      return data.content[0].text;
    }
  }
  return "";
}

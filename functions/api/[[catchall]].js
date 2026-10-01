export async function onRequest(context) {
  const request = context.request;
  const env = context.env;
  const url = new URL(request.url);

  // Handle CORS preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization, x-api-key"
      }
    });
  }

  try {
    let body = {};
    if (request.method === "POST" || request.method === "PUT") {
      try {
        body = await request.json();
      } catch (e) {
        body = {};
      }
    }

    const path = url.pathname;
    const apiKey = env.ANTHROPIC_API_KEY || env.AI_API_KEY || "";

    // 1. /api/ai/orchestrate
    if (path.includes("/ai/orchestrate")) {
      const userQuery = body.userQuery || "";
      const extracted = extractParametersFromQuery(userQuery);
      const ragContext = retrieveRagContext(userQuery);

      let explanation = "";
      if (apiKey && apiKey.length > 10) {
        try {
          explanation = await callAnthropicApi(userQuery, ragContext, apiKey);
        } catch (err) {
          console.error("Anthropic API call error:", err);
        }
      }

      if (!explanation) {
        explanation = `Goal Parsed: "${userQuery}". We recommend checking our loan EMI or rent affordability calculators to stay within recommended financial limits.`;
      }

      return jsonResponse({
        intentCode: extracted.intentCode,
        recommendedCalculatorId: extracted.recommendedCalculatorId,
        calculatorName: extracted.calculatorName,
        requiredInputs: ["principal", "annualInterestRate", "tenureValue"],
        explanation: explanation,
        retrievedContext: ragContext,
        calculationResult: null,
        extractedParameters: extracted.params
      });
    }

    // 2. /api/ai/insight
    if (path.includes("/ai/insight")) {
      const calcId = body.calculatorId || "emi";
      const inputs = body.inputData || {};
      const results = body.resultData || {};

      let status = "HEALTHY";
      let badgeColor = "bg-emerald-500";
      let keyObs = [];

      if (calcId === "emi") {
        const emi = results.monthlyEmi || 0;
        const interest = results.totalInterest || 0;
        keyObs.push(`Monthly EMI commitment is ₹${Math.round(emi).toLocaleString("en-IN")}.`);
        keyObs.push(`Total interest payout across tenure is ₹${Math.round(interest).toLocaleString("en-IN")}.`);
        keyObs.push("Rule of Thumb: Keep total monthly EMIs under 30%-40% of net income.");
      } else if (calcId === "rent-affordability") {
        const ratio = results.rentToIncomeRatio || 0;
        if (ratio > 40) { status = "HIGH_RISK"; badgeColor = "bg-red-500"; }
        else if (ratio > 30) { status = "MODERATE_RISK"; badgeColor = "bg-amber-500"; }
        keyObs.push(`Rent to income ratio is ${ratio}%.`);
        keyObs.push("Rule of Thumb: Rent under 30% leaves 20% budget for SIP compounding.");
      } else {
        keyObs.push("Calculated using standard Indian personal finance formulas.");
        keyObs.push("Maintain 6 months of essential living expenses in liquid emergency fund.");
      }

      let takeaway = "";
      if (apiKey && apiKey.length > 10) {
        try {
          const prompt = `Calculator: ${calcId}. Inputs: ${JSON.stringify(inputs)}. Results: ${JSON.stringify(results)}`;
          takeaway = await callAnthropicApi(prompt, ["Provide 2 sentences of actionable personal finance advice."], apiKey);
        } catch (e) {}
      }

      if (!takeaway) {
        takeaway = `Calculated results follow standard Indian personal finance benchmarks for ${calcId.toUpperCase()}.`;
      }

      return jsonResponse({
        healthStatus: status,
        badgeColor: badgeColor,
        title: "⚡ AI Financial Decision Insight",
        aiTakeaway: takeaway,
        keyObservations: keyObs,
        recommendedNextTool: calcId === "emi" ? "rent-affordability" : "sip"
      });
    }

    // 3. /api/calculators/emi
    if (path.includes("/calculators/emi")) {
      const P = body.principal || 2500000;
      const r = (body.annualInterestRate || 8.5) / 12 / 100;
      const n = body.tenureUnit === 'MONTHS' ? (body.tenureValue || 60) : (body.tenureValue || 5) * 12;

      const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - P;
      const principalPercentage = Math.round((P / totalPayment) * 100);
      const interestPercentage = 100 - principalPercentage;

      return jsonResponse({
        monthlyEmi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        principalAmount: P,
        principalPercentage,
        interestPercentage,
        schedule: []
      });
    }

    // 4. Default fallback for other /api routes
    return jsonResponse({
      info: "Cloudflare Pages Function Edge API active.",
      path: path
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Internal Function Error: " + error.message,
      code: "INTERNAL_ERROR"
    }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}

function jsonResponse(data, status = 200, success = true) {
  return new Response(JSON.stringify({
    success: success,
    message: success ? "Request processed (Cloudflare Edge Pages Function)" : "Request failed",
    code: success ? "SUCCESS" : "ERROR",
    data: data,
    timestamp: new Date().toISOString()
  }), {
    status: status,
    headers: {
      "content-type": "application/json;charset=UTF-8",
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

  const lakhMatches = [...query.matchAll(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l)\b/gi)];
  const lakhs = lakhMatches.map(m => parseFloat(m[1]) * 100000);

  const kMatches = [...query.matchAll(/(\d+(?:\.\d+)?)\s*(?:k|thousand|thousands)\b/gi)];
  const thousands = kMatches.map(m => parseFloat(m[1]) * 1000);

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
  const userContent = `User Query: ${userQuery}\n\nRetrieved Context:\n${Array.isArray(ragContext) ? ragContext.join("\n") : ragContext}`;

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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight OPTIONS
    if (url.pathname.startsWith('/api/') && request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // API Route Handlers
    if (url.pathname === '/api/ai/orchestrate' && request.method === 'POST') {
      return handleOrchestrate(request, env);
    }
    if (url.pathname === '/api/ai/insight' && request.method === 'POST') {
      return handleInsight(request, env);
    }
    if (url.pathname === '/api/calculators/emi' && request.method === 'POST') {
      return handleEmi(request, env);
    }
    if (url.pathname === '/api/calculators/sip' && request.method === 'POST') {
      return handleSip(request, env);
    }
    if (url.pathname === '/api/calculators/fd' && request.method === 'POST') {
      return handleFd(request, env);
    }
    if (url.pathname === '/api/calculators/salary' && request.method === 'POST') {
      return handleSalary(request, env);
    }
    if (url.pathname === '/api/calculators/gst' && request.method === 'POST') {
      return handleGst(request, env);
    }
    if (url.pathname === '/api/calculators/fuel' && request.method === 'POST') {
      return handleFuel(request, env);
    }
    if (url.pathname === '/api/calculators/inflation' && request.method === 'POST') {
      return handleInflation(request, env);
    }
    if (url.pathname === '/api/calculators/rent-affordability' && request.method === 'POST') {
      return handleRent(request, env);
    }
    if (url.pathname === '/api/ai/journey/car-affordability' && request.method === 'GET') {
      return handleCarJourney(request, env);
    }

    // For non-API routes, pass to Cloudflare Static Assets handler
    return env.ASSETS.fetch(request);
  }
};

// --- HANDLERS ---

async function handleOrchestrate(request, env) {
  try {
    const body = await request.json();
    const userQuery = body.userQuery || "";
    const apiKey = env.ANTHROPIC_API_KEY || env.AI_API_KEY || "";

    const extracted = extractParametersFromQuery(userQuery);
    const ragContext = retrieveRagContext(userQuery);

    let explanation = "";
    if (apiKey && apiKey.length > 10) {
      try {
        explanation = await callAnthropicApi(userQuery, ragContext, apiKey);
      } catch (e) {
        console.error("Worker Anthropic API Call Error:", e);
      }
    }

    if (!explanation) {
      explanation = `Goal Parsed: "${userQuery}". Based on Indian financial rules, keep loan EMIs under 30% of income and rent under 30%.`;
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
  } catch (err) {
    return jsonResponse({ error: err.message }, 500, false);
  }
}

async function handleInsight(request, env) {
  try {
    const body = await request.json();
    const calcId = body.calculatorId || "emi";
    const inputs = body.inputData || {};
    const results = body.resultData || {};
    const apiKey = env.ANTHROPIC_API_KEY || env.AI_API_KEY || "";

    let status = "HEALTHY";
    let badgeColor = "bg-emerald-500";
    let keyObs = [];

    if (calcId === "emi") {
      const emi = results.monthlyEmi || 0;
      const interest = results.totalInterest || 0;
      keyObs.push(`Monthly EMI liability is ₹${Math.round(emi).toLocaleString("en-IN")}.`);
      keyObs.push(`Total interest payout across tenure is ₹${Math.round(interest).toLocaleString("en-IN")}.`);
      keyObs.push("Rule of Thumb: Keep total EMIs under 30%-40% of net monthly income.");
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
        takeaway = await callAnthropicApi(prompt, ["Provide 2 sentences of personal finance advice."], apiKey);
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
  } catch (err) {
    return jsonResponse({ error: err.message }, 500, false);
  }
}

async function handleEmi(request, env) {
  try {
    const body = await request.json();
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
  } catch (err) {
    return jsonResponse({ error: err.message }, 400, false);
  }
}

async function handleSip(request, env) {
  try {
    const body = await request.json();
    const P = body.monthlyInvestment || 10000;
    const i = (body.expectedAnnualReturn || 12) / 12 / 100;
    const n = (body.durationYears || 10) * 12;
    const futureValue = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvestment = P * n;
    const estimatedReturns = futureValue - totalInvestment;

    return jsonResponse({
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      futureValue: Math.round(futureValue),
      disclaimer: "Returns are estimates based on expected interest rate.",
      yearlyGrowth: []
    });
  } catch (err) {
    return jsonResponse({ error: err.message }, 400, false);
  }
}

async function handleFd(request, env) {
  try {
    const body = await request.json();
    const P = body.principal || 100000;
    const r = (body.annualInterestRate || 7) / 100;
    const t = body.tenureYears || 5;
    const maturityAmount = P * Math.pow(1 + r / 4, 4 * t);
    return jsonResponse({
      principal: P,
      interestEarned: Math.round(maturityAmount - P),
      maturityAmount: Math.round(maturityAmount),
      compoundingFrequency: "QUARTERLY"
    });
  } catch (err) { return jsonResponse({ error: err.message }, 400, false); }
}

async function handleSalary(request, env) {
  try {
    const body = await request.json();
    const ctc = body.annualCtc || 1500000;
    const monthlyGross = ctc / 12;
    const pfMonthly = Math.min(monthlyGross * 0.5 * 0.12, 1800);
    const ptMonthly = 200;
    const totalDeductions = pfMonthly + ptMonthly;
    const inHand = monthlyGross - totalDeductions;
    return jsonResponse({
      annualCtc: ctc,
      monthlyGross: Math.round(monthlyGross),
      monthlyPfDeduction: Math.round(pfMonthly),
      monthlyProfessionalTax: ptMonthly,
      totalMonthlyDeductions: Math.round(totalDeductions),
      estimatedMonthlyInHand: Math.round(inHand),
      annualInHand: Math.round(inHand * 12),
      disclaimer: "Estimated based on standard Indian corporate CTC structure."
    });
  } catch (err) { return jsonResponse({ error: err.message }, 400, false); }
}

async function handleGst(request, env) {
  try {
    const body = await request.json();
    const rate = body.gstPercentage || 18;
    const amount = body.amount || 1000;
    const gstAmt = body.inclusive ? (amount - amount / (1 + rate / 100)) : (amount * rate / 100);
    const baseAmt = body.inclusive ? (amount / (1 + rate / 100)) : amount;
    return jsonResponse({
      baseAmount: Math.round(baseAmt * 100) / 100,
      gstAmount: Math.round(gstAmt * 100) / 100,
      cgst: Math.round((gstAmt / 2) * 100) / 100,
      sgst: Math.round((gstAmt / 2) * 100) / 100,
      finalAmount: Math.round((baseAmt + gstAmt) * 100) / 100,
      gstPercentage: rate,
      inclusive: !!body.inclusive
    });
  } catch (err) { return jsonResponse({ error: err.message }, 400, false); }
}

async function handleFuel(request, env) {
  try {
    const body = await request.json();
    const dist = body.distanceKm || 500;
    const mileage = body.vehicleMileageKmpl || 15;
    const price = body.fuelPricePerLitre || 100;
    const litres = dist / mileage;
    const cost = litres * price;
    return jsonResponse({
      fuelRequiredLitres: Math.round(litres * 100) / 100,
      estimatedFuelCost: Math.round(cost),
      costPerKm: Math.round((cost / dist) * 100) / 100,
      distanceKm: dist,
      vehicleMileageKmpl: mileage
    });
  } catch (err) { return jsonResponse({ error: err.message }, 400, false); }
}

async function handleInflation(request, env) {
  try {
    const body = await request.json();
    const cost = body.currentAmount || 100000;
    const rate = (body.inflationRate || 6) / 100;
    const years = body.years || 10;
    const futureCost = cost * Math.pow(1 + rate, years);
    const power = cost / Math.pow(1 + rate, years);
    return jsonResponse({
      currentAmount: cost,
      futureEquivalentAmount: Math.round(futureCost),
      purchasingPowerEquivalent: Math.round(power),
      purchasingPowerLossPercentage: Math.round((1 - power / cost) * 100),
      inflationRate: body.inflationRate || 6,
      years: years
    });
  } catch (err) { return jsonResponse({ error: err.message }, 400, false); }
}

async function handleRent(request, env) {
  try {
    const body = await request.json();
    const income = body.monthlyIncome || 100000;
    const rent = body.monthlyRent || 30000;
    const emi = body.existingMonthlyEmi || 0;
    const totalObligations = rent + emi;
    const ratio = Math.round((rent / income) * 100);
    let status = "HEALTHY";
    let color = "bg-emerald-500";
    if (ratio > 40) { status = "HIGH_RISK"; color = "bg-red-500"; }
    else if (ratio > 30) { status = "MODERATE_RISK"; color = "bg-amber-500"; }
    return jsonResponse({
      monthlyIncome: income,
      monthlyRent: rent,
      totalMonthlyObligations: totalObligations,
      remainingMonthlyIncome: income - totalObligations,
      rentToIncomeRatio: ratio,
      totalExpenseRatio: Math.round((totalObligations / income) * 100),
      affordabilityStatus: status,
      affordabilityBadgeColor: color,
      recommendation: `Rent consumes ${ratio}% of your income.`
    });
  } catch (err) { return jsonResponse({ error: err.message }, 400, false); }
}

async function handleCarJourney(request, env) {
  try {
    const url = new URL(request.url);
    const income = parseFloat(url.searchParams.get("monthlyIncome") || "120000");
    const carPrice = parseFloat(url.searchParams.get("carPrice") || "2500000");
    const downPayment = parseFloat(url.searchParams.get("downPayment") || "500000");
    const tenureYears = parseInt(url.searchParams.get("tenureYears") || "5", 10);
    const rate = parseFloat(url.searchParams.get("interestRate") || "8.5");

    const loanAmount = Math.max(0, carPrice - downPayment);
    const r = rate / 12 / 100;
    const n = tenureYears * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const fuel = (1000 / 15) * 100;

    const safeMaxEmi = income * 0.10;
    let risk = "SAFE";
    let color = "bg-emerald-500";
    if (emi > safeMaxEmi * 1.5) { risk = "HIGH_RISK"; color = "bg-red-500"; }
    else if (emi > safeMaxEmi) { risk = "MODERATE_RISK"; color = "bg-amber-500"; }

    return jsonResponse({
      monthlyIncome: income,
      carPrice: carPrice,
      downPayment: downPayment,
      loanAmount: loanAmount,
      monthlyEmi: Math.round(emi),
      monthlyFuelCost: Math.round(fuel),
      totalMonthlyExpense: Math.round(emi + fuel),
      safeMaxEmiThreshold: Math.round(safeMaxEmi),
      riskLevel: risk,
      badgeColor: color,
      aiDecisionSummary: `Total monthly car EMI (₹${Math.round(emi).toLocaleString("en-IN")}) vs safe 10% limit (₹${Math.round(safeMaxEmi).toLocaleString("en-IN")}).`,
      financialRuleChecklist: [
        `20% Down Payment Check: Offered ₹${downPayment.toLocaleString("en-IN")}`,
        `4-Year Tenure Check: Current ${tenureYears} years`,
        `10% Income Rule: Safe limit ₹${Math.round(safeMaxEmi).toLocaleString("en-IN")}`
      ],
      alternativeOptions: [
        `Option A: Increase down payment to ₹${(carPrice * 0.35).toLocaleString("en-IN")}.`,
        `Option B: Choose a model under ₹${(income * 10).toLocaleString("en-IN")}.`
      ]
    });
  } catch (err) { return jsonResponse({ error: err.message }, 400, false); }
}

// --- UTILITIES ---

function jsonResponse(data, status = 200, success = true) {
  return new Response(JSON.stringify({
    success: success,
    message: success ? "Request successful (Cloudflare Worker)" : "Request failed",
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

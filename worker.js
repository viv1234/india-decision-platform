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
    if (url.pathname === '/api/ai/chat' && request.method === 'POST') {
      return handleChat(request, env);
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
    const synthesis = buildDecisionSynthesis(extracted.intentCode, extracted.params);

    let explanation = "";
    if (apiKey && apiKey.length > 10) {
      try {
        const promptContext = `${userQuery}\n\nDecision Analysis: ${JSON.stringify(synthesis.keyMetrics)}\nRule Guidelines: ${ragContext.join("\n")}`;
        explanation = await callAnthropicApi(userQuery, promptContext, apiKey);
      } catch (e) {
        console.error("Worker Anthropic API Call Error:", e);
      }
    }

    if (!explanation) {
      explanation = synthesis.defaultExplanation;
    }

    return jsonResponse({
      intentCode: extracted.intentCode,
      recommendedCalculatorId: extracted.recommendedCalculatorId,
      calculatorName: extracted.calculatorName,
      requiredInputs: ["principal", "annualInterestRate", "tenureValue"],
      explanation: explanation,
      retrievedContext: ragContext,
      calculationResult: null,
      extractedParameters: extracted.params,
      decisionVerdict: synthesis.verdict,
      badgeColor: synthesis.badgeColor,
      followUpQuestions: synthesis.followUpQuestions,
      keyMetrics: synthesis.keyMetrics
    });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500, false);
  }
}

async function handleChat(request, env) {
  try {
    const body = await request.json();
    const query = (body.userQuery || "").trim();
    const convId = body.conversationId || "conv_" + Date.now();
    const activeContext = body.activeContext || {};
    const apiKey = env.ANTHROPIC_API_KEY || env.AI_API_KEY || "";

    const currentParams = Object.assign({}, activeContext.extractedParameters || {});
    const lower = query.toLowerCase();

    const extracted = extractParametersFromQuery(query);
    const ragContext = retrieveRagContext(query);

    let changesSummary = null;
    let comparisonData = null;

    if (lower.includes("compare") || lower.includes("versus") || lower.includes("vs")) {
      const carA = currentParams.carPrice || 2500000;
      const carB = extracted.params.carPrice || 2000000;
      const loanA = carA * 0.8;
      const loanB = carB * 0.8;
      const r = (8.5 / 12 / 100);
      const emiA = Math.round((loanA * r * Math.pow(1 + r, 60)) / (Math.pow(1 + r, 60) - 1));
      const emiB = Math.round((loanB * r * Math.pow(1 + r, 60)) / (Math.pow(1 + r, 60) - 1));

      comparisonData = {
        title: "📊 Scenario Comparison Matrix",
        scenarioA: { name: `Option A (₹${(carA/100000).toFixed(1)}L)`, metrics: { "Car Price": `₹${carA.toLocaleString("en-IN")}`, "Monthly EMI": `₹${emiA.toLocaleString("en-IN")}` } },
        scenarioB: { name: `Option B (₹${(carB/100000).toFixed(1)}L)`, metrics: { "Car Price": `₹${carB.toLocaleString("en-IN")}`, "Monthly EMI": `₹${emiB.toLocaleString("en-IN")}` } },
        comparisonHighlights: [
          `Option B reduces monthly EMI by ₹${(emiA - emiB).toLocaleString("en-IN")}/month.`,
          `Option B saves ₹${Math.round((emiA - emiB) * 60).toLocaleString("en-IN")} in total repayment over 5 years.`,
          "Recommendation: Option B maintains a significantly safer cash flow buffer."
        ]
      };
    } else if (Object.keys(extracted.params).length > 0) {
      const changeParts = [];
      for (const [key, val] of Object.entries(extracted.params)) {
        const oldVal = currentParams[key];
        if (oldVal !== undefined && oldVal !== val) {
          changeParts.push(`${key} changed from ${oldVal} to ${val}`);
        } else {
          changeParts.push(`${key} set to ${val}`);
        }
        currentParams[key] = val;
      }
      changesSummary = "⚡ Parameter Updated: " + changeParts.join(", ");
    }

    const intentCode = extracted.intentCode !== "GENERAL_QUERY" ? extracted.intentCode : (activeContext.intentCode || "CAR_AFFORDABILITY");
    const synth = buildDecisionSynthesis(intentCode, currentParams);

    let explanation = "";
    if (apiKey && apiKey.length > 10) {
      try {
        const promptText = `Query: ${query}\nActive Parameters: ${JSON.stringify(currentParams)}\nContext: ${ragContext.join("\n")}`;
        explanation = await callAnthropicApi(query, promptText, apiKey);
      } catch (e) {}
    }

    if (!explanation) {
      explanation = synth.defaultExplanation;
    }

    const message = {
      id: "msg_" + Date.now(),
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      text: explanation,
      intentCode: intentCode,
      recommendedCalculatorId: extracted.recommendedCalculatorId || activeContext.recommendedCalculatorId || "emi",
      calculatorName: extracted.calculatorName || "EMI Calculator",
      decisionVerdict: synth.verdict,
      badgeColor: synth.badgeColor,
      changesSummary: changesSummary,
      comparisonData: comparisonData,
      keyMetrics: synth.keyMetrics,
      extractedParameters: currentParams,
      followUpQuestions: synth.followUpQuestions,
      retrievedContext: ragContext
    };

    const updatedContext = {
      intentCode: intentCode,
      recommendedCalculatorId: message.recommendedCalculatorId,
      extractedParameters: currentParams,
      lastCalculationResult: null
    };

    return jsonResponse({
      conversationId: convId,
      message: message,
      updatedContext: updatedContext
    });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500, false);
  }
}

function buildDecisionSynthesis(intentCode, params) {
  let verdict = "HEALTHY";
  let badgeColor = "bg-emerald-500";
  let followUpQuestions = [];
  let keyMetrics = {};
  let defaultExplanation = "";

  if (intentCode === "RENT_AFFORDABILITY") {
    const income = params.monthlyIncome || 90000;
    const rent = params.monthlyRent || 30000;
    const ratio = Math.round((rent / income) * 1000) / 10;
    const safeMax = Math.round(income * 0.30);
    const remaining = income - rent;

    if (ratio > 40) { verdict = "HIGH_RISK"; badgeColor = "bg-red-500"; }
    else if (ratio > 30) { verdict = "MODERATE_RISK"; badgeColor = "bg-amber-500"; }

    keyMetrics = {
      "Rent-to-Income Ratio": `${ratio}%`,
      "Max Recommended Rent": `₹${safeMax.toLocaleString("en-IN")}`,
      "Remaining Monthly Budget": `₹${remaining.toLocaleString("en-IN")}`
    };

    followUpQuestions = [
      `What is the maximum safe rent budget for ₹${income.toLocaleString("en-IN")} salary?`,
      `How much monthly SIP can I invest with my remaining ₹${remaining.toLocaleString("en-IN")} income?`,
      `What if I have an existing loan EMI of ₹10,000/month?`
    ];

    defaultExplanation = `For a salary of ₹${income.toLocaleString("en-IN")}, paying ₹${rent.toLocaleString("en-IN")} rent is ${ratio}% of your income. The 30% financial rule recommends keeping rent under ₹${safeMax.toLocaleString("en-IN")}. You have ₹${remaining.toLocaleString("en-IN")} left for expenses and savings.`;
  } else if (intentCode === "CAR_AFFORDABILITY") {
    const income = params.monthlyIncome || 100000;
    const price = params.carPrice || 2500000;
    const downPayment = params.downPayment || price * 0.20;
    const loan = Math.max(0, price - downPayment);
    const emi = Math.round((loan * (0.085 / 12) * Math.pow(1 + 0.085 / 12, 60)) / (Math.pow(1 + 0.085 / 12, 60) - 1));
    const safeLimit = Math.round(income * 0.10);

    if (emi > safeLimit * 1.5) { verdict = "HIGH_RISK"; badgeColor = "bg-red-500"; }
    else if (emi > safeLimit) { verdict = "MODERATE_RISK"; badgeColor = "bg-amber-500"; }

    keyMetrics = {
      "Estimated Car EMI": `₹${emi.toLocaleString("en-IN")}/mo`,
      "10% Safe EMI Threshold": `₹${safeLimit.toLocaleString("en-IN")}/mo`,
      "Down Payment": `₹${downPayment.toLocaleString("en-IN")}`
    };

    followUpQuestions = [
      `How much down payment is required to buy a ₹${(price / 100000).toFixed(1)} Lakh car safely?`,
      `What car price range is safe for ₹${income.toLocaleString("en-IN")} monthly salary?`,
      `How much will extending loan tenure from 5 to 7 years reduce EMI?`
    ];

    defaultExplanation = `A ₹${(price / 100000).toFixed(1)} Lakh car generates an EMI of ~₹${emi.toLocaleString("en-IN")}/month. The 20-4-10 rule suggests keeping total car expenses under ₹${safeLimit.toLocaleString("en-IN")}/month (10% of gross salary).`;
  } else if (intentCode === "SALARY_INHAND") {
    const ctc = params.annualCtc || 1500000;
    const gross = ctc / 12;
    const inhand = gross - (Math.min(gross * 0.5 * 0.12, 1800) + 200);

    keyMetrics = {
      "Annual CTC": `₹${(ctc / 100000).toFixed(1)} LPA`,
      "Monthly Gross": `₹${Math.round(gross).toLocaleString("en-IN")}`,
      "Est. Net In-Hand": `₹${Math.round(inhand).toLocaleString("en-IN")}/mo`
    };

    followUpQuestions = [
      `How can I reduce TDS tax deductions on my salary?`,
      `How much should I invest in EPF & Section 80C to maximize in-hand?`,
      `Compare Old Tax Regime vs New Tax Regime for my CTC`
    ];

    defaultExplanation = `For a CTC of ₹${(ctc / 100000).toFixed(1)} LPA, your estimated monthly in-hand salary is ~₹${Math.round(inhand).toLocaleString("en-IN")} after standard PF and Professional Tax deductions.`;
  } else if (intentCode === "SIP_GROWTH") {
    const inv = params.monthlyInvestment || 10000;
    const total = inv * 120;
    const fv = Math.round(inv * ((Math.pow(1 + 0.01, 120) - 1) / 0.01) * 1.01);

    keyMetrics = {
      "Monthly SIP": `₹${inv.toLocaleString("en-IN")}`,
      "Total Invested (10 Yrs)": `₹${total.toLocaleString("en-IN")}`,
      "Estimated Wealth": `₹${fv.toLocaleString("en-IN")}`
    };

    followUpQuestions = [
      `How much will my SIP wealth grow if I step up investment by 10% yearly?`,
      `Should I invest in Index Funds or Flexi-Cap Mutual Funds?`,
      `What is the inflation-adjusted value of my future SIP returns?`
    ];

    defaultExplanation = `Investing ₹${inv.toLocaleString("en-IN")}/month in a SIP for 10 years at an expected 12% annual return can grow your ₹${total.toLocaleString("en-IN")} investment into ₹${fv.toLocaleString("en-IN")}.`;
  } else {
    followUpQuestions = [
      `How does this decision impact my monthly emergency savings buffer?`,
      `Which calculator should I use next to optimize my budget?`,
      `What are the tax implications of this financial decision?`
    ];

    defaultExplanation = `Goal Parsed: "${params.userQuery || 'Financial query'}". We recommend checking our loan EMI, salary, or rent calculators to verify your numbers against financial guidelines.`;
  }

  return { verdict, badgeColor, followUpQuestions, keyMetrics, defaultExplanation };
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

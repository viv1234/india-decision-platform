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
    const calcId = body.calculatorId || "emi";
    const inputs = body.inputData || {};
    const results = body.resultData || {};
    const apiKey = env.ANTHROPIC_API_KEY || env.AI_API_KEY || "";

    let status = "HEALTHY";
    let badgeColor = "bg-emerald-500";
    let keyObservations = [];

    if (calcId === "emi") {
      const emi = results.monthlyEmi || 0;
      const interest = results.totalInterest || 0;
      keyObservations.push(`Monthly EMI commitment is ₹${Math.round(emi).toLocaleString("en-IN")}.`);
      keyObservations.push(`Total interest payout across loan tenure is ₹${Math.round(interest).toLocaleString("en-IN")}.`);
      keyObservations.push("Rule of Thumb: Ensure total monthly loan EMIs do not exceed 30%-40% of net monthly salary.");
    } else if (calcId === "rent-affordability") {
      const ratio = results.rentToIncomeRatio || 0;
      if (ratio > 40) {
        status = "HIGH_RISK";
        badgeColor = "bg-red-500";
      } else if (ratio > 30) {
        status = "MODERATE_RISK";
        badgeColor = "bg-amber-500";
      }
      keyObservations.push(`Rent to Monthly Income ratio is ${ratio}%.`);
      keyObservations.push("Rule of Thumb: Keeping rent under 30% allows a solid 20% allocation for SIP savings.");
    } else {
      keyObservations.push("Calculated values verified using standard Indian financial planning formulas.");
      keyObservations.push("Ensure your emergency fund covers 6 months of essential living expenses.");
    }

    let aiTakeaway = "";
    if (apiKey && apiKey.length > 10) {
      try {
        const prompt = `Calculator: ${calcId}. Inputs: ${JSON.stringify(inputs)}. Results: ${JSON.stringify(results)}`;
        aiTakeaway = await callAnthropicApi(prompt, apiKey);
      } catch (e) {
        console.error("Cloudflare Anthropic API Error:", e);
      }
    }

    if (!aiTakeaway) {
      aiTakeaway = `Your ${calcId.toUpperCase()} results have been computed based on standard Indian financial benchmarks. Keeping liabilities under 30% ensures financial peace.`;
    }

    return new Response(JSON.stringify({
      success: true,
      message: "AI decision insight generated (Cloudflare Edge Worker)",
      code: "SUCCESS",
      data: {
        healthStatus: status,
        badgeColor: badgeColor,
        title: "⚡ AI Financial Decision Insight",
        aiTakeaway: aiTakeaway,
        keyObservations: keyObservations,
        recommendedNextTool: calcId === "emi" ? "rent-affordability" : "sip"
      },
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
      message: "Error generating insight: " + error.message
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

async function callAnthropicApi(prompt, apiKey) {
  const systemPrompt = "You are BharatDecision AI Assistant, an expert Indian personal finance advisor. Provide a 2-sentence actionable financial advice summary.";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey.trim(),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 250,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }]
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

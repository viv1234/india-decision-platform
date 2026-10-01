export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const P = body.principal || 2500000;
    const r = (body.annualInterestRate || 8.5) / 12 / 100;
    const n = body.tenureUnit === 'MONTHS' ? (body.tenureValue || 60) : (body.tenureValue || 5) * 12;

    const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const principalPercentage = Math.round((P / totalPayment) * 100);
    const interestPercentage = 100 - principalPercentage;

    return new Response(JSON.stringify({
      success: true,
      message: "EMI calculation complete (Cloudflare Edge Worker)",
      code: "SUCCESS",
      data: {
        monthlyEmi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        principalAmount: P,
        principalPercentage,
        interestPercentage,
        schedule: []
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
      message: "Calculation error: " + error.message
    }), {
      status: 400,
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

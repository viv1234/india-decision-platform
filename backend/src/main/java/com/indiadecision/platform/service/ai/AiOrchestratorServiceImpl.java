package com.indiadecision.platform.service.ai;

import com.indiadecision.platform.dto.*;
import com.indiadecision.platform.service.EmiCalculatorService;
import com.indiadecision.platform.service.FuelCostCalculatorService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiOrchestratorServiceImpl implements AiOrchestratorService {

    private final AiIntentDetector intentDetector;
    private final CalculatorToolRegistry toolRegistry;
    private final EmiCalculatorService emiCalculatorService;
    private final FuelCostCalculatorService fuelCostCalculatorService;
    private final FinancialRagKnowledgeService ragKnowledgeService;
    private final AiApiClient aiApiClient;

    public AiOrchestratorServiceImpl(
            AiIntentDetector intentDetector,
            CalculatorToolRegistry toolRegistry,
            EmiCalculatorService emiCalculatorService,
            FuelCostCalculatorService fuelCostCalculatorService,
            FinancialRagKnowledgeService ragKnowledgeService,
            AiApiClient aiApiClient) {
        this.intentDetector = intentDetector;
        this.toolRegistry = toolRegistry;
        this.emiCalculatorService = emiCalculatorService;
        this.fuelCostCalculatorService = fuelCostCalculatorService;
        this.ragKnowledgeService = ragKnowledgeService;
        this.aiApiClient = aiApiClient;
    }

    @Override
    public AiOrchestrationResponseDto orchestrate(AiOrchestrationRequestDto request) {
        String query = request.getUserQuery() != null ? request.getUserQuery() : "";
        
        // 1. Intent Detection
        AiIntentDetector.AiIntentResult intentResult = intentDetector.detectIntent(query);
        AiToolDescriptor descriptor = toolRegistry.getDescriptor(intentResult.recommendedCalculatorId());
        String toolName = descriptor != null ? descriptor.getToolName() : "Financial Calculator";

        // 2. RAG Knowledge Context Retrieval
        List<RagKnowledgeDocument> contextDocs = ragKnowledgeService.retrieveRelevantKnowledge(query, 3);
        List<String> contextSnippets = contextDocs.stream()
                .map(d -> String.format("[%s]: %s (Ref: %s)", d.getTitle(), d.getContent(), d.getSourceRule()))
                .collect(Collectors.toList());

        // 3. AI / RAG Generated Explanation
        String explanation = aiApiClient.generateRagResponse(query, contextDocs, toolName);

        // 4. Parameter Extraction from Natural Prompt
        Map<String, Object> extractedParams = extractParameters(query, intentResult.intent());

        // 5. Execution Result Calculation (if applicable)
        Object result = null;
        if (intentResult.intent() == AiIntent.CAR_AFFORDABILITY || intentResult.intent() == AiIntent.LOAN_AFFORDABILITY) {
            double principal = extractedParams.containsKey("principal") ? (double) extractedParams.get("principal") : 2500000.0;
            double rate = extractedParams.containsKey("annualInterestRate") ? (double) extractedParams.get("annualInterestRate") : 8.5;
            int tenure = extractedParams.containsKey("tenureValue") ? (int) extractedParams.get("tenureValue") : 5;
            result = emiCalculatorService.calculateEmi(new EmiRequestDto(principal, rate, tenure, "YEARS"));
        }

        return new AiOrchestrationResponseDto(
                intentResult.intent().name(),
                intentResult.recommendedCalculatorId(),
                toolName,
                intentResult.requiredInputs(),
                explanation,
                contextSnippets,
                result,
                extractedParams
        );
    }

    @Override
    public AiInsightResponseDto generateInsight(AiInsightRequestDto request) {
        String calcId = request.getCalculatorId() != null ? request.getCalculatorId() : "general";
        Map<String, Object> inputs = request.getInputData() != null ? request.getInputData() : Collections.emptyMap();
        Map<String, Object> results = request.getResultData() != null ? request.getResultData() : Collections.emptyMap();

        String prompt = String.format("Calculator: %s. Inputs: %s. Output Results: %s", calcId, inputs, results);
        List<RagKnowledgeDocument> contextDocs = ragKnowledgeService.retrieveRelevantKnowledge(calcId + " financial rules", 2);

        String aiAnalysis = aiApiClient.generateRagResponse(prompt, contextDocs, calcId.toUpperCase() + " Tool");

        String status = "HEALTHY";
        String color = "bg-emerald-500";
        List<String> keyObservations = new ArrayList<>();

        if (calcId.equalsIgnoreCase("emi")) {
            Object emiObj = results.get("monthlyEmi");
            Object totalInterestObj = results.get("totalInterest");
            if (emiObj instanceof Number) {
                double emi = ((Number) emiObj).doubleValue();
                keyObservations.add(String.format("Monthly EMI liability is ₹%,.0f.", emi));
            }
            if (totalInterestObj instanceof Number) {
                double interest = ((Number) totalInterestObj).doubleValue();
                keyObservations.add(String.format("Total interest payout across loan tenure is ₹%,.0f.", interest));
            }
            keyObservations.add("Rule of Thumb: Ensure total monthly loan EMIs do not exceed 30%-40% of net monthly salary.");
        } else if (calcId.equalsIgnoreCase("rent-affordability")) {
            Object ratioObj = results.get("rentToIncomeRatio");
            if (ratioObj instanceof Number) {
                double ratio = ((Number) ratioObj).doubleValue();
                if (ratio > 40) {
                    status = "HIGH_RISK";
                    color = "bg-red-500";
                } else if (ratio > 30) {
                    status = "MODERATE_RISK";
                    color = "bg-amber-500";
                }
                keyObservations.add(String.format("Rent to Monthly Income ratio is %.1f%%.", ratio));
            }
            keyObservations.add("Rule of Thumb: Keeping rent under 30% allows a solid 20% allocation for SIP savings.");
        } else {
            keyObservations.add("Calculated values verified using standard Indian financial planning formulas.");
            keyObservations.add("Ensure your emergency fund covers 6 months of essential living expenses.");
        }

        return new AiInsightResponseDto(
                status,
                color,
                "⚡ AI Financial Decision Insight",
                aiAnalysis,
                keyObservations,
                calcId.equalsIgnoreCase("emi") ? "rent-affordability" : "sip"
        );
    }

    @Override
    public CarAffordabilityJourneyResponseDto evaluateCarAffordabilityJourney(
            double monthlyIncome, double carPrice, double downPayment, int tenureYears, double interestRate) {
        
        double loanAmount = Math.max(0, carPrice - downPayment);
        EmiResponseDto emiRes = emiCalculatorService.calculateEmi(new EmiRequestDto(loanAmount, interestRate, tenureYears, "YEARS"));
        double monthlyEmi = emiRes.getMonthlyEmi();

        // Estimated fuel cost for 1,000 km/month at 15 kmpl @ 100/L = ~₹6,667
        FuelCostResponseDto fuelRes = fuelCostCalculatorService.calculateFuelCost(new FuelCostRequestDto(1000.0, 15.0, 100.0));
        double monthlyFuelCost = fuelRes.getEstimatedFuelCost();

        double totalMonthlyExpense = monthlyEmi + monthlyFuelCost;

        // 20-4-10 Rule: Max safe EMI is 10% of monthly income
        double safeMaxEmiThreshold = monthlyIncome * 0.10;

        String riskLevel = "SAFE";
        String color = "bg-emerald-500";
        if (monthlyEmi > safeMaxEmiThreshold * 1.5) {
            riskLevel = "HIGH_RISK";
            color = "bg-red-500";
        } else if (monthlyEmi > safeMaxEmiThreshold) {
            riskLevel = "MODERATE_RISK";
            color = "bg-amber-500";
        }

        List<String> checklist = List.of(
                String.format("20%% Down Payment Check: Offered ₹%,.0f (Minimum ₹%,.0f needed)", downPayment, carPrice * 0.20),
                String.format("4-Year Loan Tenure Check: Current tenure %d years", tenureYears),
                String.format("10%% Gross Income EMI Rule: Max recommended EMI ₹%,.0f vs Actual EMI ₹%,.0f", safeMaxEmiThreshold, monthlyEmi)
        );

        List<String> options = List.of(
                String.format("Option A: Increase down payment to ₹%,.0f to bring EMI under 10%% threshold.", carPrice * 0.35),
                String.format("Option B: Consider a reliable car model priced under ₹%,.0f.", monthlyIncome * 10),
                "Option C: Allocate additional monthly savings to an equity SIP for 2 years before purchase."
        );

        String prompt = String.format("Car Affordability Evaluation. Income: ₹%.0f, Car Price: ₹%.0f, Down Payment: ₹%.0f, Monthly EMI: ₹%.0f, Fuel: ₹%.0f. Safe EMI Limit: ₹%.0f.",
                monthlyIncome, carPrice, downPayment, monthlyEmi, monthlyFuelCost, safeMaxEmiThreshold);

        List<RagKnowledgeDocument> docs = ragKnowledgeService.retrieveRelevantKnowledge("car affordability 20 4 10 rule", 2);
        String aiAdvice = aiApiClient.generateRagResponse(prompt, docs, "Car Affordability Journey Engine");

        return new CarAffordabilityJourneyResponseDto(
                monthlyIncome, carPrice, downPayment, loanAmount,
                monthlyEmi, monthlyFuelCost, totalMonthlyExpense,
                safeMaxEmiThreshold, riskLevel, color,
                aiAdvice, checklist, options
        );
    }

    @Override
    public AiChatResponseDto processChat(AiChatRequestDto request) {
        String convId = request.getConversationId() != null ? request.getConversationId() : UUID.randomUUID().toString();
        String query = request.getUserQuery() != null ? request.getUserQuery().trim() : "";

        AiChatRequestDto.ActiveContextDto context = request.getActiveContext();
        if (context == null) {
            context = new AiChatRequestDto.ActiveContextDto();
        }

        Map<String, Object> currentParams = new HashMap<>(context.getExtractedParameters() != null ? context.getExtractedParameters() : Collections.emptyMap());
        String lower = query.toLowerCase(Locale.ROOT);

        // Detect intent
        AiIntentDetector.AiIntentResult intentResult = intentDetector.detectIntent(query);
        boolean isNewIntent = context.getIntentCode() == null || (!context.getIntentCode().equals(intentResult.intent().name()) && (lower.contains("car") || lower.contains("rent") || lower.contains("salary") || lower.contains("sip")));

        if (isNewIntent) {
            currentParams.clear();
            context.setIntentCode(intentResult.intent().name());
            context.setRecommendedCalculatorId(intentResult.recommendedCalculatorId());
        }

        // Extract newly specified params from query
        Map<String, Object> newlyExtracted = extractParameters(query, intentResult.intent());
        String changesSummary = null;
        AiChatResponseDto.ComparisonDataDto comparison = null;

        // Check if user is asking for scenario comparison (e.g. "Compare this with a 20 lakh car")
        if (lower.contains("compare") || lower.contains("versus") || lower.contains("vs")) {
            comparison = buildComparisonScenario(query, currentParams, newlyExtracted);
        } else if (!newlyExtracted.isEmpty()) {
            // Parameter modification update
            StringBuilder changes = new StringBuilder("⚡ Parameter Updated: ");
            for (Map.Entry<String, Object> entry : newlyExtracted.entrySet()) {
                Object oldVal = currentParams.get(entry.getKey());
                if (oldVal != null && !oldVal.equals(entry.getValue())) {
                    changes.append(String.format("%s changed from %s to %s. ", entry.getKey(), oldVal, entry.getValue()));
                } else {
                    changes.append(String.format("%s set to %s. ", entry.getKey(), entry.getValue()));
                }
                currentParams.put(entry.getKey(), entry.getValue());
            }
            changesSummary = changes.toString().trim();
        }

        context.setExtractedParameters(currentParams);

        // RAG Context & AI Explanation
        List<RagKnowledgeDocument> contextDocs = ragKnowledgeService.retrieveRelevantKnowledge(query, 2);
        List<String> snippets = contextDocs.stream().map(d -> String.format("[%s]: %s", d.getTitle(), d.getContent())).collect(Collectors.toList());

        AiToolDescriptor descriptor = toolRegistry.getDescriptor(context.getRecommendedCalculatorId());
        String toolName = descriptor != null ? descriptor.getToolName() : "Financial Tool";

        String promptContext = String.format("Query: %s. Active Params: %s. RAG Guidelines: %s", query, currentParams, snippets);
        String explanation = aiApiClient.generateRagResponse(promptContext, contextDocs, toolName);

        // Synthesize Health Verdict & Key Metrics
        AiOrchestrationResponseDto synth = orchestrate(new AiOrchestrationRequestDto(query));
        
        AiChatResponseDto.ChatMessageDto message = new AiChatResponseDto.ChatMessageDto();
        message.setId(UUID.randomUUID().toString());
        message.setSender("assistant");
        message.setTimestamp(new java.text.SimpleDateFormat("HH:mm").format(new Date()));
        message.setText(explanation);
        message.setIntentCode(context.getIntentCode());
        message.setRecommendedCalculatorId(context.getRecommendedCalculatorId());
        message.setCalculatorName(toolName);
        message.setDecisionVerdict(synth.getDecisionVerdict());
        message.setBadgeColor(synth.getBadgeColor());
        message.setChangesSummary(changesSummary);
        message.setKeyMetrics(synth.getKeyMetrics());
        message.setComparisonData(comparison);
        message.setExtractedParameters(currentParams);
        message.setFollowUpQuestions(synth.getFollowUpQuestions());
        message.setRetrievedContext(snippets);

        context.setLastCalculationResult(synth.getCalculationResult());

        return new AiChatResponseDto(convId, message, context);
    }

    private AiChatResponseDto.ComparisonDataDto buildComparisonScenario(String query, Map<String, Object> currentParams, Map<String, Object> newlyExtracted) {
        AiChatResponseDto.ComparisonDataDto comp = new AiChatResponseDto.ComparisonDataDto();
        comp.setTitle("📊 Scenario Comparison Matrix");

        double carA = currentParams.containsKey("carPrice") ? ((Number) currentParams.get("carPrice")).doubleValue() : 2500000;
        double carB = newlyExtracted.containsKey("carPrice") ? ((Number) newlyExtracted.get("carPrice")).doubleValue() : 2000000;

        EmiResponseDto resA = emiCalculatorService.calculateEmi(new EmiRequestDto(carA * 0.8, 8.5, 5, "YEARS"));
        EmiResponseDto resB = emiCalculatorService.calculateEmi(new EmiRequestDto(carB * 0.8, 8.5, 5, "YEARS"));

        Map<String, String> metricsA = new HashMap<>();
        metricsA.put("Car Price", String.format("₹%,.0f", carA));
        metricsA.put("Loan Amount", String.format("₹%,.0f", carA * 0.8));
        metricsA.put("Monthly EMI", String.format("₹%,.0f", resA.getMonthlyEmi()));
        metricsA.put("Total Interest", String.format("₹%,.0f", resA.getTotalInterest()));

        Map<String, String> metricsB = new HashMap<>();
        metricsB.put("Car Price", String.format("₹%,.0f", carB));
        metricsB.put("Loan Amount", String.format("₹%,.0f", carB * 0.8));
        metricsB.put("Monthly EMI", String.format("₹%,.0f", resB.getMonthlyEmi()));
        metricsB.put("Total Interest", String.format("₹%,.0f", resB.getTotalInterest()));

        comp.setScenarioA(new AiChatResponseDto.ScenarioDto(String.format("Option A (₹%,.0f)", carA), metricsA));
        comp.setScenarioB(new AiChatResponseDto.ScenarioDto(String.format("Option B (₹%,.0f)", carB), metricsB));

        double emiDiff = resA.getMonthlyEmi() - resB.getMonthlyEmi();
        double interestDiff = resA.getTotalInterest() - resB.getTotalInterest();

        List<String> highlights = new ArrayList<>();
        highlights.add(String.format("Option B reduces monthly EMI by ₹%,.0f/month.", emiDiff));
        highlights.add(String.format("Option B saves ₹%,.0f in total interest over 5 years.", interestDiff));
        highlights.add("Recommendation: Option B maintains a significantly healthier monthly cash flow buffer.");

        comp.setComparisonHighlights(highlights);
        return comp;
    }

    private Map<String, Object> extractParameters(String query, AiIntent intent) {
        Map<String, Object> map = new HashMap<>();
        if (query == null) return map;

        // Parse Lakhs (e.g., "1.2 Lakh", "25 Lakh", "15 Lakh", "5L")
        Pattern lakhPattern = Pattern.compile("(?i)(\\d+(?:\\.\\d+)?)\\s*(?:lakh|lakhs|l)\\b");
        Matcher lakhMatcher = lakhPattern.matcher(query);
        List<Double> lakhsFound = new ArrayList<>();
        while (lakhMatcher.find()) {
            try {
                lakhsFound.add(Double.parseDouble(lakhMatcher.group(1)) * 100000);
            } catch (Exception ignored) {}
        }

        // Parse Thousands (e.g. "30,000", "30k")
        Pattern kPattern = Pattern.compile("(?i)(\\d+(?:\\.\\d+)?)\\s*(?:k|thousand|thousands)\\b");
        Matcher kMatcher = kPattern.matcher(query);
        List<Double> thousandsFound = new ArrayList<>();
        while (kMatcher.find()) {
            try {
                thousandsFound.add(Double.parseDouble(kMatcher.group(1)) * 1000);
            } catch (Exception ignored) {}
        }

        // Parse Years (e.g. "5 years", "5 yr")
        Pattern yrPattern = Pattern.compile("(?i)(\\d+)\\s*(?:years|year|yr|yrs)\\b");
        Matcher yrMatcher = yrPattern.matcher(query);
        if (yrMatcher.find()) {
            map.put("tenureValue", Integer.parseInt(yrMatcher.group(1)));
        }

        if (intent == AiIntent.CAR_AFFORDABILITY || intent == AiIntent.LOAN_AFFORDABILITY) {
            if (lakhsFound.size() >= 2) {
                map.put("monthlyIncome", lakhsFound.get(0));
                map.put("principal", lakhsFound.get(1));
                map.put("carPrice", lakhsFound.get(1));
            } else if (lakhsFound.size() == 1) {
                map.put("principal", lakhsFound.get(0));
                map.put("carPrice", lakhsFound.get(0));
            }
            if (!map.containsKey("annualInterestRate")) {
                map.put("annualInterestRate", 8.5);
            }
        } else if (intent == AiIntent.RENT_AFFORDABILITY) {
            if (lakhsFound.size() >= 1) map.put("monthlyIncome", lakhsFound.get(0));
            if (thousandsFound.size() >= 1) map.put("monthlyRent", thousandsFound.get(0));
        } else if (intent == AiIntent.SALARY_INHAND) {
            if (lakhsFound.size() >= 1) map.put("annualCtc", lakhsFound.get(0));
        } else if (intent == AiIntent.SIP_GROWTH) {
            if (thousandsFound.size() >= 1) map.put("monthlyInvestment", thousandsFound.get(0));
            if (lakhsFound.size() >= 1) map.put("monthlyInvestment", lakhsFound.get(0));
        }

        return map;
    }
}

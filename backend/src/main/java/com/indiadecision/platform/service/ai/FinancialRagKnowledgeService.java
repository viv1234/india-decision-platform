package com.indiadecision.platform.service.ai;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class FinancialRagKnowledgeService {

    private final List<RagKnowledgeDocument> knowledgeBase = new ArrayList<>();

    public FinancialRagKnowledgeService() {
        initKnowledgeBase();
    }

    private void initKnowledgeBase() {
        knowledgeBase.add(new RagKnowledgeDocument(
                "rag-1", "Loans & EMI", "Car & Personal Loan Affordability Standard",
                "Financial Planning 20-4-10 Rule for Car Purchases: Down payment should be at least 20%, loan tenure maximum 4 years, and monthly vehicle expenses (EMI + Fuel + Insurance) should not exceed 10% to 15% of net monthly income. EMI should never exceed 30% of net monthly income.",
                "RBI Guidelines & Standard Personal Finance Rules"
        ));

        knowledgeBase.add(new RagKnowledgeDocument(
                "rag-2", "Loans & Rent", "Rent-to-Income Affordability Limit",
                "30% Rent Rule: Monthly house rent should ideally be under 30% of net take-home salary. If total monthly obligations (Existing EMIs + Proposed Rent) exceed 50% of income, financial risk is classified as HIGH_RISK.",
                "Urban Housing Financial Benchmarks India"
        ));

        knowledgeBase.add(new RagKnowledgeDocument(
                "rag-3", "Investments & Wealth", "SIP Wealth Compounding & 15-15-15 Rule",
                "SIP (Systematic Investment Plan) 15-15-15 Rule: Investing ₹15,000 per month for 15 years at an expected annual return of 15% generates approx ₹1 Crore in wealth. Compounding returns accelerate exponentially after 7-10 years.",
                "SEBI Investor Education Guidelines"
        ));

        knowledgeBase.add(new RagKnowledgeDocument(
                "rag-4", "Taxation & Income", "Indian CTC vs In-Hand Salary Deductions",
                "Income Tax & CTC Breakdown Rules: Annual CTC includes Basic Salary (~50%), HRA (~20%), Special Allowances, Employer PF (12% of Basic), Professional Tax (₹2,500/yr in most states), and TDS. Standard deduction of ₹75,000 applies under New Tax Regime (FY 2024-25/25-26).",
                "Income Tax Act 1961 - Union Budget Amendments"
        ));

        knowledgeBase.add(new RagKnowledgeDocument(
                "rag-5", "GST Tax", "GST Tax Rates & Calculation Rules",
                "GST (Goods and Services Tax) in India is divided into CGST (Central GST) and SGST (State GST) in equal halves for intra-state transactions. Standard slabs are 5%, 12%, 18%, and 28%. Exclusive rate adds GST to base price; inclusive rate extracts GST from total price.",
                "GST Council India Statutory Rules"
        ));

        knowledgeBase.add(new RagKnowledgeDocument(
                "rag-6", "Inflation & Economy", "Inflation Impact & Purchasing Power Depreciation",
                "Average Retail Inflation (CPI) in India historically averages between 5% and 7% per annum. At 6% inflation, the purchasing power of money reduces by 50% in approx 12 years (Rule of 72).",
                "RBI Monetary Policy Reports"
        ));

        knowledgeBase.add(new RagKnowledgeDocument(
                "rag-7", "Fixed Deposit", "Fixed Deposit (FD) Quarterly Compounding Rules",
                "Indian Banks compound Fixed Deposit interest quarterly using formula A = P(1 + r/n)^(n*t) where n=4. Senior citizens typically receive 0.50% extra interest rate.",
                "RBI Scheduled Commercial Bank Circulars"
        ));
    }

    public List<RagKnowledgeDocument> retrieveRelevantKnowledge(String query, int topK) {
        if (query == null || query.isBlank()) {
            return knowledgeBase.subList(0, Math.min(topK, knowledgeBase.size()));
        }

        String lowerQuery = query.toLowerCase(Locale.ROOT);
        List<RagKnowledgeDocument> scoredList = new ArrayList<>();

        for (RagKnowledgeDocument doc : knowledgeBase) {
            double score = calculateRelevance(lowerQuery, doc);
            doc.setRelevanceScore(score);
            if (score > 0) {
                scoredList.add(doc);
            }
        }

        scoredList.sort((d1, d2) -> Double.compare(d2.getRelevanceScore(), d1.getRelevanceScore()));

        if (scoredList.isEmpty()) {
            return knowledgeBase.subList(0, Math.min(topK, knowledgeBase.size()));
        }

        return scoredList.subList(0, Math.min(topK, scoredList.size()));
    }

    private double calculateRelevance(String query, RagKnowledgeDocument doc) {
        double score = 0.0;
        String content = (doc.getTitle() + " " + doc.getCategory() + " " + doc.getContent() + " " + doc.getSourceRule()).toLowerCase(Locale.ROOT);

        String[] tokens = query.split("\\s+");
        for (String token : tokens) {
            if (token.length() <= 2) continue;
            if (content.contains(token)) {
                score += 1.0;
                if (doc.getCategory().toLowerCase(Locale.ROOT).contains(token)) {
                    score += 1.5;
                }
            }
        }
        return score;
    }
}

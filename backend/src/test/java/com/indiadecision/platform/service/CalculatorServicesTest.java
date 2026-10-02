package com.indiadecision.platform.service;

import com.indiadecision.platform.dto.*;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.impl.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CalculatorServicesTest {

    private EmiCalculatorService emiService;
    private SipCalculatorService sipService;
    private FdCalculatorService fdService;
    private SalaryCalculatorService salaryService;
    private GstCalculatorService gstService;
    private PercentageCalculatorService percentageService;
    private DiscountCalculatorService discountService;
    private FuelCostCalculatorService fuelService;
    private InflationCalculatorService inflationService;
    private RentAffordabilityService rentService;

    @BeforeEach
    void setUp() {
        emiService = new EmiCalculatorServiceImpl();
        sipService = new SipCalculatorServiceImpl();
        fdService = new FdCalculatorServiceImpl();
        salaryService = new SalaryCalculatorServiceImpl();
        gstService = new GstCalculatorServiceImpl();
        percentageService = new PercentageCalculatorServiceImpl();
        discountService = new DiscountCalculatorServiceImpl();
        fuelService = new FuelCostCalculatorServiceImpl();
        inflationService = new InflationCalculatorServiceImpl();
        rentService = new RentAffordabilityServiceImpl();
    }

    // --- EMI TESTS ---

    @Test
    @DisplayName("EMI: Normal Loan Calculation")
    void testEmiNormalLoan() {
        EmiRequestDto req = new EmiRequestDto(2500000.0, 8.5, 5, "YEARS");
        EmiResponseDto res = emiService.calculateEmi(req);

        assertNotNull(res);
        assertTrue(res.getMonthlyEmi() > 50000 && res.getMonthlyEmi() < 52000);
        assertTrue(res.getTotalInterest() > 500000);
        assertEquals(2500000.0, res.getPrincipalAmount());
        assertEquals(60, res.getSchedule().size());
    }

    @Test
    @DisplayName("EMI: Zero Interest Rate")
    void testEmiZeroInterest() {
        EmiRequestDto req = new EmiRequestDto(120000.0, 0.0, 1, "YEARS");
        EmiResponseDto res = emiService.calculateEmi(req);

        assertEquals(10000.0, res.getMonthlyEmi());
        assertEquals(0.0, res.getTotalInterest());
        assertEquals(120000.0, res.getTotalPayment());
    }

    @Test
    @DisplayName("EMI: Invalid Amount")
    void testEmiInvalidAmount() {
        EmiRequestDto req = new EmiRequestDto(-500.0, 8.5, 5, "YEARS");
        assertThrows(InvalidInputException.class, () -> emiService.calculateEmi(req));
    }

    @Test
    @DisplayName("EMI: Invalid Tenure")
    void testEmiInvalidTenure() {
        EmiRequestDto req = new EmiRequestDto(100000.0, 8.5, 0, "YEARS");
        assertThrows(InvalidInputException.class, () -> emiService.calculateEmi(req));
    }

    // --- SIP TESTS ---

    @Test
    @DisplayName("SIP: Normal Investment")
    void testSipNormalInvestment() {
        SipRequestDto req = new SipRequestDto(10000.0, 12.0, 10);
        SipResponseDto res = sipService.calculateSip(req);

        assertEquals(1200000.0, res.getTotalInvestment());
        assertTrue(res.getFutureValue() > 2200000.0);
        assertTrue(res.getEstimatedReturns() > 1000000.0);
        assertEquals(10, res.getYearlyGrowth().size());
    }

    @Test
    @DisplayName("SIP: Zero Return")
    void testSipZeroReturn() {
        SipRequestDto req = new SipRequestDto(5000.0, 0.0, 5);
        SipResponseDto res = sipService.calculateSip(req);

        assertEquals(300000.0, res.getTotalInvestment());
        assertEquals(300000.0, res.getFutureValue());
        assertEquals(0.0, res.getEstimatedReturns());
    }

    @Test
    @DisplayName("SIP: Invalid Duration")
    void testSipInvalidDuration() {
        SipRequestDto req = new SipRequestDto(5000.0, 10.0, -2);
        assertThrows(InvalidInputException.class, () -> sipService.calculateSip(req));
    }

    // --- FD TESTS ---

    @Test
    @DisplayName("FD: Normal Calculation")
    void testFdNormal() {
        FdRequestDto req = new FdRequestDto(100000.0, 7.5, 3, "QUARTERLY");
        FdResponseDto res = fdService.calculateFd(req);

        assertEquals(100000.0, res.getPrincipal());
        assertTrue(res.getMaturityAmount() > 124000);
        assertTrue(res.getInterestEarned() > 24000);
    }

    // --- SALARY TESTS ---

    @Test
    @DisplayName("Salary: Standard CTC")
    void testSalaryStandard() {
        SalaryRequestDto req = new SalaryRequestDto(1200000.0, null, null, null, null, 200.0, 0.0);
        SalaryResponseDto res = salaryService.calculateSalary(req);

        assertEquals(1200000.0, res.getAnnualCtc());
        assertEquals(100000.0, res.getMonthlyGross());
        assertTrue(res.getEstimatedMonthlyInHand() < 100000.0);
    }

    // --- GST TESTS ---

    @Test
    @DisplayName("GST: Exclusive Rate")
    void testGstExclusive() {
        GstRequestDto req = new GstRequestDto(1000.0, 18.0, false);
        GstResponseDto res = gstService.calculateGst(req);

        assertEquals(1000.0, res.getBaseAmount());
        assertEquals(180.0, res.getGstAmount());
        assertEquals(90.0, res.getCgst());
        assertEquals(90.0, res.getSgst());
        assertEquals(1180.0, res.getFinalAmount());
    }

    @Test
    @DisplayName("GST: Inclusive Rate")
    void testGstInclusive() {
        GstRequestDto req = new GstRequestDto(1180.0, 18.0, true);
        GstResponseDto res = gstService.calculateGst(req);

        assertEquals(1000.0, res.getBaseAmount());
        assertEquals(180.0, res.getGstAmount());
        assertEquals(1180.0, res.getFinalAmount());
    }

    // --- PERCENTAGE TESTS ---

    @Test
    @DisplayName("Percentage: Percentage Of")
    void testPercentageOf() {
        PercentageRequestDto req = new PercentageRequestDto("PERCENTAGE_OF", 25.0, 200.0);
        PercentageResponseDto res = percentageService.calculatePercentage(req);

        assertEquals(50.0, res.getResult());
    }

    @Test
    @DisplayName("Percentage: Increase")
    void testPercentageIncrease() {
        PercentageRequestDto req = new PercentageRequestDto("PERCENTAGE_INCREASE", 10.0, 100.0);
        PercentageResponseDto res = percentageService.calculatePercentage(req);

        assertEquals(110.0, res.getResult());
    }

    @Test
    @DisplayName("Percentage: Decrease")
    void testPercentageDecrease() {
        PercentageRequestDto req = new PercentageRequestDto("PERCENTAGE_DECREASE", 20.0, 100.0);
        PercentageResponseDto res = percentageService.calculatePercentage(req);

        assertEquals(80.0, res.getResult());
    }

    // --- DISCOUNT TESTS ---

    @Test
    @DisplayName("Discount: Normal Price")
    void testDiscountNormal() {
        DiscountRequestDto req = new DiscountRequestDto(2000.0, 15.0);
        DiscountResponseDto res = discountService.calculateDiscount(req);

        assertEquals(300.0, res.getDiscountAmount());
        assertEquals(1700.0, res.getFinalPrice());
        assertEquals(300.0, res.getAmountSaved());
    }

    // --- FUEL TESTS ---

    @Test
    @DisplayName("Fuel: Normal Calculation")
    void testFuelNormal() {
        FuelCostRequestDto req = new FuelCostRequestDto(500.0, 15.0, 100.0);
        FuelCostResponseDto res = fuelService.calculateFuelCost(req);

        assertEquals(33.33, res.getFuelRequiredLitres());
        assertEquals(3333.33, res.getEstimatedFuelCost());
        assertEquals(6.67, res.getCostPerKm());
    }

    // --- INFLATION TESTS ---

    @Test
    @DisplayName("Inflation: Normal Calculation")
    void testInflationNormal() {
        InflationRequestDto req = new InflationRequestDto(100000.0, 6.0, 10);
        InflationResponseDto res = inflationService.calculateInflation(req);

        assertTrue(res.getFutureEquivalentAmount() > 179000.0);
        assertTrue(res.getPurchasingPowerEquivalent() < 56000.0);
    }

    // --- RENT AFFORDABILITY TESTS ---

    @Test
    @DisplayName("Rent Affordability: Comfortable")
    void testRentAffordabilityComfortable() {
        RentAffordabilityRequestDto req = new RentAffordabilityRequestDto(100000.0, 10000.0, 20000.0, 15000.0);
        RentAffordabilityResponseDto res = rentService.calculateRentAffordability(req);

        assertEquals(55000.0, res.getRemainingMonthlyIncome());
        assertEquals(20.0, res.getRentToIncomeRatio());
        assertEquals("Comfortably Affordable", res.getAffordabilityStatus());
        assertEquals("green", res.getAffordabilityBadgeColor());
    }

    // --- CONVERSATIONAL AI DECISION ENGINE TESTS ---

    @Test
    @DisplayName("AI Chat: Car Affordability Complete Question")
    void testProcessChatCarAffordability() {
        com.indiadecision.platform.service.ai.AiOrchestratorServiceImpl orchestrator = new com.indiadecision.platform.service.ai.AiOrchestratorServiceImpl(
                new com.indiadecision.platform.service.ai.AiIntentDetectorImpl(),
                new com.indiadecision.platform.service.ai.CalculatorToolRegistry(),
                emiService,
                fuelService,
                new com.indiadecision.platform.service.ai.FinancialRagKnowledgeService(),
                new com.indiadecision.platform.service.ai.AiApiClient()
        );

        AiChatRequestDto req = new AiChatRequestDto();
        req.setUserQuery("I earn ₹1.2 lakh per month. Can I afford a ₹25 lakh car with ₹5 lakh down payment?");
        
        AiChatResponseDto res = orchestrator.processChat(req);
        assertNotNull(res);
        assertNotNull(res.getMessage());
        assertEquals("CAR_AFFORDABILITY", res.getMessage().getIntentCode());
        assertEquals(120000.0, res.getMessage().getExtractedParameters().get("monthlyIncome"));
        assertEquals(2500000.0, res.getMessage().getExtractedParameters().get("carPrice"));
        assertEquals(500000.0, res.getMessage().getExtractedParameters().get("downPayment"));
    }

    @Test
    @DisplayName("AI Chat: Out of Scope Question Handling")
    void testProcessChatOutOfScope() {
        com.indiadecision.platform.service.ai.AiOrchestratorServiceImpl orchestrator = new com.indiadecision.platform.service.ai.AiOrchestratorServiceImpl(
                new com.indiadecision.platform.service.ai.AiIntentDetectorImpl(),
                new com.indiadecision.platform.service.ai.CalculatorToolRegistry(),
                emiService,
                fuelService,
                new com.indiadecision.platform.service.ai.FinancialRagKnowledgeService(),
                new com.indiadecision.platform.service.ai.AiApiClient()
        );

        AiChatRequestDto req = new AiChatRequestDto();
        req.setUserQuery("Who won the cricket match yesterday?");

        AiChatResponseDto res = orchestrator.processChat(req);
        assertNotNull(res);
        assertEquals("OUT_OF_SCOPE", res.getMessage().getQueryType());
        assertTrue(res.getMessage().getText().contains("Financial Decision Engine"));
    }
}

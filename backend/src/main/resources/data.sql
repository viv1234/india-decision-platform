-- Pre-populating calculator metadata

INSERT INTO calculators (id, name, category, description, icon, route, active, display_order)
VALUES 
('emi', 'EMI Calculator', 'Loans', 'Calculate monthly loan EMI, interest breakdown and repayment schedule.', 'calculator', '/calculators/emi', true, 1),
('sip', 'SIP Calculator', 'Finance', 'Estimate wealth accumulation through Systematic Investment Plans.', 'trending-up', '/calculators/sip', true, 2),
('fd', 'Fixed Deposit (FD)', 'Finance', 'Calculate guaranteed maturity returns and interest earned on fixed deposits.', 'piggy-bank', '/calculators/fd', true, 3),
('salary', 'Salary / CTC Calculator', 'Salary', 'Estimate monthly take-home in-hand salary and total deductions from CTC.', 'briefcase', '/calculators/salary', true, 4),
('gst', 'GST Calculator', 'Shopping', 'Compute CGST, SGST and total price for GST inclusive/exclusive rates.', 'receipt', '/calculators/gst', true, 5),
('percentage', 'Percentage Calculator', 'Lifestyle', 'Easily calculate percentage of value, increases, decreases and differences.', 'percent', '/calculators/percentage', true, 6),
('discount', 'Discount Calculator', 'Shopping', 'Find out final price after discount and total savings while shopping.', 'tag', '/calculators/discount', true, 7),
('fuel', 'Fuel Cost Calculator', 'Lifestyle', 'Calculate trip fuel costs, required litres, and per-kilometer expense.', 'fuel', '/calculators/fuel', true, 8),
('inflation', 'Inflation Calculator', 'Finance', 'Understand future cost of living and purchasing power impact over time.', 'arrow-up-right', '/calculators/inflation', true, 9),
('rent-affordability', 'Rent Affordability', 'Loans', 'Evaluate rent budget against income, existing EMIs and expense ratio.', 'home', '/calculators/rent-affordability', true, 10)
ON CONFLICT (id) DO UPDATE SET 
name = EXCLUDED.name,
category = EXCLUDED.category,
description = EXCLUDED.description,
icon = EXCLUDED.icon,
route = EXCLUDED.route,
display_order = EXCLUDED.display_order;

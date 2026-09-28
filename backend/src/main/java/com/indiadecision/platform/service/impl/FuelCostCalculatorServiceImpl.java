package com.indiadecision.platform.service.impl;

import com.indiadecision.platform.dto.FuelCostRequestDto;
import com.indiadecision.platform.dto.FuelCostResponseDto;
import com.indiadecision.platform.exception.InvalidInputException;
import com.indiadecision.platform.service.FuelCostCalculatorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FuelCostCalculatorServiceImpl implements FuelCostCalculatorService {

    @Override
    public FuelCostResponseDto calculateFuelCost(FuelCostRequestDto request) {
        if (request.getDistanceKm() == null || request.getDistanceKm() <= 0) {
            throw new InvalidInputException("Distance must be greater than zero");
        }
        if (request.getVehicleMileageKmpl() == null || request.getVehicleMileageKmpl() <= 0) {
            throw new InvalidInputException("Vehicle mileage must be greater than zero");
        }
        if (request.getFuelPricePerLitre() == null || request.getFuelPricePerLitre() <= 0) {
            throw new InvalidInputException("Fuel price per litre must be greater than zero");
        }

        double dist = request.getDistanceKm();
        double mileage = request.getVehicleMileageKmpl();
        double price = request.getFuelPricePerLitre();

        double fuelRequired = dist / mileage;
        double totalCost = fuelRequired * price;
        double costPerKm = price / mileage;

        return new FuelCostResponseDto(
                roundTwoDecimals(fuelRequired),
                roundTwoDecimals(totalCost),
                roundTwoDecimals(costPerKm),
                dist,
                mileage
        );
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}

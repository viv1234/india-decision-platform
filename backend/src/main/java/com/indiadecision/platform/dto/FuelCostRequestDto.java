package com.indiadecision.platform.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class FuelCostRequestDto {

    @NotNull(message = "Distance is required")
    @Positive(message = "Distance must be greater than zero")
    private Double distanceKm;

    @NotNull(message = "Vehicle mileage is required")
    @Positive(message = "Mileage must be greater than zero")
    private Double vehicleMileageKmpl;

    @NotNull(message = "Fuel price is required")
    @Positive(message = "Fuel price must be greater than zero")
    private Double fuelPricePerLitre;

    public FuelCostRequestDto() {}

    public FuelCostRequestDto(Double distanceKm, Double vehicleMileageKmpl, Double fuelPricePerLitre) {
        this.distanceKm = distanceKm;
        this.vehicleMileageKmpl = vehicleMileageKmpl;
        this.fuelPricePerLitre = fuelPricePerLitre;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Double getVehicleMileageKmpl() {
        return vehicleMileageKmpl;
    }

    public void setVehicleMileageKmpl(Double vehicleMileageKmpl) {
        this.vehicleMileageKmpl = vehicleMileageKmpl;
    }

    public Double getFuelPricePerLitre() {
        return fuelPricePerLitre;
    }

    public void setFuelPricePerLitre(Double fuelPricePerLitre) {
        this.fuelPricePerLitre = fuelPricePerLitre;
    }
}

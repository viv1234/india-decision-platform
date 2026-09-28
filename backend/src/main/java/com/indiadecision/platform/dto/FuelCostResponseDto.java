package com.indiadecision.platform.dto;

public class FuelCostResponseDto {
    private double fuelRequiredLitres;
    private double estimatedFuelCost;
    private double costPerKm;
    private double distanceKm;
    private double vehicleMileageKmpl;

    public FuelCostResponseDto() {}

    public FuelCostResponseDto(double fuelRequiredLitres, double estimatedFuelCost, double costPerKm, double distanceKm, double vehicleMileageKmpl) {
        this.fuelRequiredLitres = fuelRequiredLitres;
        this.estimatedFuelCost = estimatedFuelCost;
        this.costPerKm = costPerKm;
        this.distanceKm = distanceKm;
        this.vehicleMileageKmpl = vehicleMileageKmpl;
    }

    public double getFuelRequiredLitres() {
        return fuelRequiredLitres;
    }

    public void setFuelRequiredLitres(double fuelRequiredLitres) {
        this.fuelRequiredLitres = fuelRequiredLitres;
    }

    public double getEstimatedFuelCost() {
        return estimatedFuelCost;
    }

    public void setEstimatedFuelCost(double estimatedFuelCost) {
        this.estimatedFuelCost = estimatedFuelCost;
    }

    public double getCostPerKm() {
        return costPerKm;
    }

    public void setCostPerKm(double costPerKm) {
        this.costPerKm = costPerKm;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public double getVehicleMileageKmpl() {
        return vehicleMileageKmpl;
    }

    public void setVehicleMileageKmpl(double vehicleMileageKmpl) {
        this.vehicleMileageKmpl = vehicleMileageKmpl;
    }
}

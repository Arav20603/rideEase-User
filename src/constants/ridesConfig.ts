export const rideTypes = {
  bike: { baseFare: 30, pricePerKm: 10 },
  auto: { baseFare: 50, pricePerKm: 15 },
  car: { baseFare: 80, pricePerKm: 20 },
  suv: { baseFare: 120, pricePerKm: 25 },
  luxury: { baseFare: 200, pricePerKm: 40 },
  metro: { baseFare: 10, pricePerKm: 5 },
} as const;
export default EnergyPriceLevels;

function EnergyPriceLevels(vat = 1) {
  let priceLevels = {};
  const basePriceLevels = {
    low: 50,
    medium: 150,
    concerning: 250,
    high: 400,
  };

  for (let key in basePriceLevels) {
    priceLevels[key] = Math.round((basePriceLevels[key] * vat) / 10) * 10;
  }

  return priceLevels;
}

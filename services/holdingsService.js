const dummyCompanyList = Array.from({ length: 1000 }, (_, i) => `Company ${i + 1}`);

function parseRange(rangeStr) {
  const [start, end] = rangeStr.split('-').map(Number);
  return dummyCompanyList.slice(start - 1, end);
}

async function analyzeHoldings(funds) {
  const companyInvestment = {};

  for (const fund of funds) {
    const companies = parseRange(fund.topTierRange || '1-50');
    const weight = 1 / companies.length;
    for (const company of companies) {
      const investedAmount = fund.amount * weight;
      if (!companyInvestment[company]) {
        companyInvestment[company] = 0;
      }
      companyInvestment[company] += investedAmount;
    }
  }

  const total = funds.reduce((sum, f) => sum + f.amount, 0);
  const result = Object.entries(companyInvestment).map(([company, amount]) => ({
    company,
    amount: +amount.toFixed(2),
    percentage: +((amount / total) * 100).toFixed(2)
  }));

  return {
    totalInvestment: total,
    breakdown: result.sort((a, b) => b.amount - a.amount)
  };
}

module.exports = { analyzeHoldings };

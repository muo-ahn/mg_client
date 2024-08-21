// src/components.contest/FormatCurrency.js

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'decimal' }).format(amount);
  };
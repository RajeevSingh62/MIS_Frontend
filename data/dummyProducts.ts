export interface Product {
  id: number;
  bank_id: number;
  title: string;
}

const dummyProducts: Product[] = [
  // HDFC (bank_id: 1)
  { id: 101, bank_id: 1, title: 'Personal Loan' },
  { id: 102, bank_id: 1, title: 'Credit Card' },
  { id: 103, bank_id: 1, title: 'Savings Account' },
  { id: 104, bank_id: 1, title: 'Home Loan' },
  // Kotak (bank_id: 2)
  { id: 201, bank_id: 2, title: 'Personal Loan' },
  { id: 202, bank_id: 2, title: 'Credit Card' },
  { id: 203, bank_id: 2, title: 'Savings Account' },
  // ICICI (bank_id: 3)
  { id: 301, bank_id: 3, title: 'Personal Loan' },
  { id: 302, bank_id: 3, title: 'Credit Card' },
  { id: 303, bank_id: 3, title: 'Home Loan' },
  { id: 304, bank_id: 3, title: 'Auto Loan' },
  // IndusInd (bank_id: 4)
  { id: 401, bank_id: 4, title: 'Personal Loan' },
  { id: 402, bank_id: 4, title: 'Credit Card' },
  { id: 403, bank_id: 4, title: 'Savings Account' },
  // SBI (bank_id: 5)
  { id: 501, bank_id: 5, title: 'Personal Loan' },
  { id: 502, bank_id: 5, title: 'Home Loan' },
  { id: 503, bank_id: 5, title: 'Savings Account' },
  // Bajaj (bank_id: 6)
  { id: 601, bank_id: 6, title: 'Personal Loan' },
  { id: 602, bank_id: 6, title: 'EMI Card' },
  { id: 603, bank_id: 6, title: 'Business Loan' },
];

export default dummyProducts;

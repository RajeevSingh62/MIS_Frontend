export interface Bank {
  id: number;
  bank_title: string;
  bank_code: string;
}

const dummyBanks: Bank[] = [
  { id: 1, bank_title: 'HDFC Bank',         bank_code: 'HDFC' },
  { id: 2, bank_title: 'Kotak Mahindra',    bank_code: 'KOTAK' },
  { id: 3, bank_title: 'ICICI Bank',        bank_code: 'ICICI' },
  { id: 4, bank_title: 'IndusInd Bank',     bank_code: 'INDUSIND' },
  { id: 5, bank_title: 'State Bank of India', bank_code: 'SBI' },
  { id: 6, bank_title: 'Bajaj Finserv',     bank_code: 'BAJAJ' },
];

export default dummyBanks;

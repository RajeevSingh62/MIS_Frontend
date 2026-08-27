export interface ProductMapping {
  id: number;
  sourceProductName: string;
  productId: number;
  productTitle: string;
}

export interface UnmappedProduct {
  sourceProductName: string;
  leadCount: number;
}

// Existing confirmed mappings per bank_id
export const dummyProductMappings: Record<number, ProductMapping[]> = {
  1: [
    { id: 1, sourceProductName: 'PL-HDFC',       productId: 101, productTitle: 'Personal Loan' },
    { id: 2, sourceProductName: 'CC-HDFC-SUPER',  productId: 102, productTitle: 'Credit Card' },
    { id: 3, sourceProductName: 'SA-REGULAR',     productId: 103, productTitle: 'Savings Account' },
  ],
  2: [
    { id: 4, sourceProductName: 'PERSONAL-LOAN',  productId: 201, productTitle: 'Personal Loan' },
    { id: 5, sourceProductName: 'CREDIT-CARD',    productId: 202, productTitle: 'Credit Card' },
  ],
  3: [
    { id: 6, sourceProductName: 'ICICI-PL',       productId: 301, productTitle: 'Personal Loan' },
  ],
  4: [],
  5: [
    { id: 7, sourceProductName: 'SBI-HL',         productId: 502, productTitle: 'Home Loan' },
  ],
  6: [],
};

// Unmapped product strings per bank_id
export const dummyUnmappedProducts: Record<number, UnmappedProduct[]> = {
  1: [
    { sourceProductName: 'HDFC-HL-PRIME',   leadCount: 42 },
    { sourceProductName: 'CC-HDFC-MILLENIA', leadCount: 18 },
  ],
  2: [
    { sourceProductName: 'SA-KOTAK-811',    leadCount: 31 },
  ],
  3: [
    { sourceProductName: 'ICICI-AUTOLOAN',  leadCount: 15 },
    { sourceProductName: 'ICICI-HL',        leadCount: 9 },
  ],
  4: [
    { sourceProductName: 'INDUSIND-PL',     leadCount: 22 },
    { sourceProductName: 'INDUSIND-CC',     leadCount: 11 },
  ],
  5: [],
  6: [
    { sourceProductName: 'BAJAJ-FLEXI',     leadCount: 38 },
  ],
};

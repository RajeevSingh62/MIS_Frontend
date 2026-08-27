export interface UploadRecord {
  id: number;
  bankTitle: string;
  filename: string;
  uploadedBy: string;
  uploadedAt: string;
  totalRows: number;
  successRows: number;
  exceptionRows: number;
  status: 'Completed' | 'Processing' | 'Failed';
}

const dummyUploadHistory: UploadRecord[] = [
  { id: 1, bankTitle: 'HDFC Bank',    filename: 'hdfc_leads_jul_w1.xlsx',  uploadedBy: 'Rajeev K', uploadedAt: '2024-07-08 10:30', totalRows: 1850, successRows: 1789, exceptionRows: 61,  status: 'Completed' },
  { id: 2, bankTitle: 'Kotak Mahindra', filename: 'kotak_mis_jul8.xlsx',   uploadedBy: 'Priya M',  uploadedAt: '2024-07-08 11:15', totalRows: 920,  successRows: 898,  exceptionRows: 22,  status: 'Completed' },
  { id: 3, bankTitle: 'ICICI Bank',   filename: 'icici_weekly_jul8.csv',   uploadedBy: 'Rajeev K', uploadedAt: '2024-07-08 14:00', totalRows: 2400, successRows: 2310, exceptionRows: 90,  status: 'Completed' },
  { id: 4, bankTitle: 'HDFC Bank',    filename: 'hdfc_leads_jun_w4.xlsx',  uploadedBy: 'Anjali S', uploadedAt: '2024-07-01 09:45', totalRows: 1600, successRows: 1555, exceptionRows: 45,  status: 'Completed' },
  { id: 5, bankTitle: 'IndusInd Bank', filename: 'indusind_leads_jul.xlsx', uploadedBy: 'Priya M', uploadedAt: '2024-07-05 16:20', totalRows: 730,  successRows: 710,  exceptionRows: 20,  status: 'Completed' },
  { id: 6, bankTitle: 'SBI',          filename: 'sbi_monthly_jun.xlsx',    uploadedBy: 'Rajeev K', uploadedAt: '2024-07-02 13:00', totalRows: 3100, successRows: 2980, exceptionRows: 120, status: 'Completed' },
  { id: 7, bankTitle: 'Bajaj Finserv', filename: 'bajaj_leads_jul1.xlsx',  uploadedBy: 'Anjali S', uploadedAt: '2024-07-03 10:00', totalRows: 540,  successRows: 528,  exceptionRows: 12,  status: 'Completed' },
  { id: 8, bankTitle: 'Kotak Mahindra', filename: 'kotak_mis_jul1.xlsx',   uploadedBy: 'Priya M',  uploadedAt: '2024-07-01 15:30', totalRows: 810,  successRows: 793,  exceptionRows: 17,  status: 'Completed' },
];

export default dummyUploadHistory;

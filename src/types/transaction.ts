export interface EntryType {
  key: string;
  amount: number;
  chartCode: string;
  description: string;
}

export interface Transaction {
  creditArr: EntryType[];
  debitArr: EntryType[];
  type: string;
  referenceNo: string;
  description: string;
}
  
export enum TransactionType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  PAYMENT = 'PAYMENT',
  RECEIPT = 'RECEIPT',
  ADJSUTMENT = 'ADJSUTMENT'
}

export enum TransactionStatus {
  POSTED = 'posted',
  VOIDED = 'voided',
}

export interface DraftTransaction {
  debitEntries: EntryType[]
  creditEntries: EntryType[]
  transactionId: number
  referenceNo: string
  description:string
  type: TransactionType
  amount: number
}

export interface SaleData {
  dataDate: string;
  salesRevenue: number;
  serviceRevenue: number;
  rentRevenue: number;
  intersetRevenue: number;
  otherRevenue: number;
  costOfGoodSold: number;
  salary: number;
  rentExpense: number;
  utilityExpense: number;
  dereceationExpense: number;
  intersetExpense: number;
  otherExpense: number;
}
// Platform bank account that receives wallet top-ups and employee perk payments.
// This is the Perx-of-record receiving account shown on invoices.
export const PLATFORM_BANK = {
  beneficiary_name: "Perx Sh.p.k.",
  iban: "AL47 2121 1009 0000 0002 3569 8741",
  swift: "TIRBALTR",
  bank_name: "Tirana Bank",
  currency: "ALL",
  tax_id: "NIPT L92210001A",
  address: "Rr. Ibrahim Rugova, Tirana, Albania",
} as const;

export type BankSnapshot = {
  beneficiary_name: string;
  iban: string;
  swift?: string | null;
  bank_name: string;
  currency: string;
  tax_id?: string;
  address?: string;
};

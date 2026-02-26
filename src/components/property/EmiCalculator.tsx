"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

interface EmiCalculatorProps {
  /** Property price in rupees */
  price: number;
}

function formatLakhs(val: number): string {
  const lakhs = val / 100000;
  if (lakhs >= 100) return `${(lakhs / 100).toFixed(1)}Cr`;
  return `${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)}L`;
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function EmiCalculator({ price }: EmiCalculatorProps) {
  const maxLoan = price;
  const defaultLoan = Math.round(price * 0.8);

  const [loanAmount, setLoanAmount] = useState(defaultLoan);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5);

  const loanPct = Math.round((loanAmount / maxLoan) * 100);

  const emi = useMemo(() => {
    const p = loanAmount;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (r === 0) return p / n;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, tenure, rate]);

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-5">
      <h3 className="font-display text-lg font-semibold flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" />
        EMI Calculator
      </h3>

      {/* Loan Amount */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Loan Amount ({loanPct}%)</span>
          <span className="font-semibold">{formatLakhs(loanAmount)}</span>
        </div>
        <input
          type="range"
          min={500000}
          max={maxLoan}
          step={100000}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Tenure */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tenure</span>
          <span className="font-semibold">{tenure} years</span>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Interest Rate</span>
          <span className="font-semibold">{rate}%</span>
        </div>
        <input
          type="range"
          min={5}
          max={15}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Result */}
      <div className="rounded-md bg-primary/5 py-4 text-center space-y-1">
        <p className="text-sm text-muted-foreground">Estimated Monthly EMI</p>
        <p className="text-2xl font-bold text-primary">{formatCurrency(emi)}</p>
      </div>
    </div>
  );
}

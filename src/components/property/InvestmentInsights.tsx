import { TrendingUp, Landmark, MapPin, Building } from 'lucide-react';

interface InvestmentData {
  rentalYieldPct?: number;
  appreciationTrendText?: string;
  futureInfrastructureText?: string;
  developerTrackRecordSummary?: string;
}

export function InvestmentInsights({ data }: { data: InvestmentData }) {
  if (!data || !Object.values(data).some(Boolean)) return null;

  return (
    <div className="py-6 border-b border-border">
      <h3 className="font-display text-lg font-semibold mb-4">Investment Insights</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.rentalYieldPct != null && (
          <div className="flex gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Rental Yield</p>
              <p className="font-semibold">{data.rentalYieldPct}%</p>
            </div>
          </div>
        )}
        {data.appreciationTrendText && (
          <div className="flex gap-3">
            <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Appreciation Trend</p>
              <p className="text-sm">{data.appreciationTrendText}</p>
            </div>
          </div>
        )}
        {data.futureInfrastructureText && (
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Future Infrastructure</p>
              <p className="text-sm">{data.futureInfrastructureText}</p>
            </div>
          </div>
        )}
        {data.developerTrackRecordSummary && (
          <div className="flex gap-3">
            <Building className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Developer Track Record</p>
              <p className="text-sm">{data.developerTrackRecordSummary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

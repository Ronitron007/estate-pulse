import { Building2, Home, Layers, CheckCircle } from 'lucide-react';

interface ProjectDetailsExtra {
  totalTowers?: number;
  totalUnits?: number;
  floors?: number;
  constructionStatus?: string;
  facingOptions?: string[];
}

export function ProjectDetailStats({ data, vastuCompliant }: { data: ProjectDetailsExtra; vastuCompliant?: boolean }) {
  const hasData = data.totalTowers != null || data.totalUnits != null || data.floors != null || vastuCompliant;
  if (!hasData) return null;

  return (
    <div className="py-6 border-b border-border">
      <h3 className="font-display text-lg font-semibold mb-4">Project Details</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.totalTowers != null && (
          <div className="text-center">
            <Building2 className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold">{data.totalTowers}</p>
            <p className="text-xs text-muted-foreground">Towers</p>
          </div>
        )}
        {data.totalUnits != null && (
          <div className="text-center">
            <Home className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold">{data.totalUnits}</p>
            <p className="text-xs text-muted-foreground">Total Units</p>
          </div>
        )}
        {data.floors != null && (
          <div className="text-center">
            <Layers className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold">{data.floors}</p>
            <p className="text-xs text-muted-foreground">Floors</p>
          </div>
        )}
        {vastuCompliant && (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-1 h-5 w-5 text-green-600" />
            <p className="text-sm font-semibold text-green-600">Vastu</p>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </div>
        )}
      </div>
      {data.facingOptions?.length ? (
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Facing:</span> {data.facingOptions.join(', ')}
        </p>
      ) : null}
    </div>
  );
}

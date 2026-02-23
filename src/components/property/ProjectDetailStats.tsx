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
   <div>
      {/* {data.facingOptions?.length ? (
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Facing:</span> {data.facingOptions.join(', ')}
        </p>
      ) : null} */}
    </div>
  );
}

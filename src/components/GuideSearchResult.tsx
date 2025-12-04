import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Rocket, Navigation, Zap, Bell, Building2, Users, FileUp,
  Target, TrendingUp, Settings, CheckSquare, FolderOpen, FileSearch, FilePlus,
  CalendarPlus, ListOrdered, UserPlus, Filter, FileText, GraduationCap, Network,
  PieChart, History, Briefcase, ListTodo, FileSignature, CheckCircle, PenTool,
  Send, FileBarChart, Shield, Leaf, BarChart, Activity, FileSpreadsheet, BarChart3,
  BookOpen, ArrowRight, Lightbulb, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GuideEntry, categoryLabels } from '@/data/legacyGuideData';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Rocket, Navigation, Zap, Bell, Building2, Users, FileUp,
  Target, TrendingUp, Settings, CheckSquare, FolderOpen, FileSearch, FilePlus,
  CalendarPlus, ListOrdered, UserPlus, Filter, FileText, GraduationCap, Network,
  PieChart, History, Briefcase, ListTodo, FileSignature, CheckCircle, PenTool,
  Send, FileBarChart, Shield, Leaf, BarChart, Activity, FileSpreadsheet, BarChart3
};

interface GuideSearchResultProps {
  guide: GuideEntry;
  onNavigate?: () => void;
}

export const GuideSearchResult: React.FC<GuideSearchResultProps> = ({ guide, onNavigate }) => {
  const navigate = useNavigate();
  const Icon = iconMap[guide.icon] || BookOpen;

  const handleNavigate = () => {
    navigate(guide.route);
    onNavigate?.();
  };

  return (
    <div className="bg-card/50 border border-border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-legacy-500/10 text-legacy-500">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground">{guide.module}</h4>
          <Badge variant="outline" className="text-xs mt-1">
            {categoryLabels[guide.category]}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {guide.shortDescription}
      </p>

      {/* How to access */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-legacy-600">
          <MapPin className="h-3.5 w-3.5" />
          <span>Como acessar:</span>
        </div>
        <p className="text-xs text-muted-foreground pl-5">
          Menu lateral → {categoryLabels[guide.category]} → {guide.module}
        </p>
      </div>

      {/* How to use */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-legacy-600">
          <Settings className="h-3.5 w-3.5" />
          <span>Como usar:</span>
        </div>
        <ol className="text-xs text-muted-foreground space-y-1 pl-5">
          {guide.howTo.slice(0, 4).map((step, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-legacy-500 font-medium">{idx + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
          {guide.howTo.length > 4 && (
            <li className="text-legacy-500 text-xs">+ {guide.howTo.length - 4} passos...</li>
          )}
        </ol>
      </div>

      {/* Tips */}
      {guide.tips.length > 0 && (
        <div className="bg-legacy-500/5 rounded-md p-2.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-legacy-600">
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Dica:</span>
          </div>
          <p className="text-xs text-muted-foreground pl-5">
            {guide.tips[0]}
          </p>
        </div>
      )}

      {/* Related modules */}
      {guide.relatedModules.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Relacionados:</span>
          {guide.relatedModules.map((mod, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {mod}
            </Badge>
          ))}
        </div>
      )}

      {/* Navigate button */}
      <Button 
        onClick={handleNavigate}
        className="w-full bg-legacy-500 hover:bg-legacy-600 text-white"
        size="sm"
      >
        <span>Ir para {guide.module}</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default GuideSearchResult;

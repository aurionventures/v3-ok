import { useState, useEffect } from "react";
import { ChecklistCategory, ChecklistProgress } from "@/types/documentChecklist";
import { initialDocumentChecklist } from "@/data/documentChecklistData";
import { 
  Building,
  Shield,
  Users,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  FolderPlus
} from "lucide-react";

const STORAGE_KEY = 'document-checklist';

// Icon mapping to avoid serializing React components
const iconMap = {
  societario: Building,
  governanca: Shield,
  familia: Users,
  compliance: AlertCircle,
  riscos: AlertTriangle,
  financeiro: BarChart3,
  personalizado: FolderPlus
};

export const useDocumentChecklist = () => {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(initialDocumentChecklist);

  // Load checklist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedChecklist = JSON.parse(saved);
  
        if (!Array.isArray(savedChecklist)) {
          console.warn('Invalid checklist data format');
          return;
        }
        
        const checklistWithIcons = savedChecklist.map((category) => {
          // Validação de estrutura básica
          if (!category || typeof category !== 'object' || !category.id) {
            console.warn('Invalid category structure:', category);
            return null;
          }
          
          return {
            ...category,
            icon: iconMap[category.id as keyof typeof iconMap] || Building
          };
        }).filter(Boolean); // Remove categorias inválidas
        setChecklist(checklistWithIcons);
      } catch (error) {
        console.error('Error loading checklist from localStorage:', error);
      }
    }
  }, []);

  // Save checklist to localStorage whenever it changes (without icons)
  useEffect(() => {
    const checklistToSave = checklist.map(({ icon, ...category }) => category);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistToSave));
  }, [checklist]);

  const calculateProgress = (): ChecklistProgress => {
    const totalItems = checklist.reduce((total, category) => total + category.items.length, 0);
    const checkedItems = checklist.reduce((total, category) => 
      total + category.items.filter(item => item.checked).length, 0
    );
    const completionPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

    return { totalItems, checkedItems, completionPercentage };
  };

  const handleItemCheck = (categoryIndex: number, itemIndex: number, checked: boolean) => {
    const newChecklist = [...checklist];
    newChecklist[categoryIndex].items[itemIndex].checked = checked;
    setChecklist(newChecklist);
  };

  const handleStatusChange = (categoryIndex: number, itemIndex: number, status: "not-applicable" | "not-have" | "not-sent" | null) => {
    const newChecklist = [...checklist];
    newChecklist[categoryIndex].items[itemIndex].status = status;
    setChecklist(newChecklist);
  };

  const getCategoryProgress = (category: ChecklistCategory) => {
    const categoryProgress = category.items.filter(item => item.checked).length;
    const categoryTotal = category.items.length;
    const categoryPercentage = Math.round((categoryProgress / categoryTotal) * 100);

    return { categoryProgress, categoryTotal, categoryPercentage };
  };

  const getAISuggestions = (completionPercentage: number): string => {
    if (completionPercentage < 25) {
      return "Comece pelos documentos societários básicos: Contrato Social e Acordo de Sócios.";
    } else if (completionPercentage < 50) {
      return "Foque agora na governança: desenvolva o Regimento do Conselho e Protocolo Familiar.";
    } else if (completionPercentage < 75) {
      return "Implemente políticas de compliance: Código de Conduta e controles internos.";
    } else {
      return "Finalize com relatórios de transparência e auditoria para completar a governança.";
    }
  };

  const addCustomItem = (itemName: string) => {
    const customCategoryIndex = checklist.findIndex(c => c.id === 'personalizado');
    
    if (customCategoryIndex === -1) {
      // Create "Documentos Personalizados" category if it doesn't exist
      const newCategory: ChecklistCategory = {
        id: 'personalizado',
        name: 'Documentos Personalizados',
        icon: FolderPlus,
        color: 'text-cyan-500',
        items: [{ 
          id: `custom-${Date.now()}`, 
          name: itemName, 
          checked: true, 
          hasDocument: true, 
          status: null 
        }]
      };
      setChecklist([...checklist, newCategory]);
    } else {
      // Add to existing category
      const newChecklist = [...checklist];
      newChecklist[customCategoryIndex].items.push({
        id: `custom-${Date.now()}`,
        name: itemName,
        checked: true,
        hasDocument: true,
        status: null
      });
      setChecklist(newChecklist);
    }
  };

  return {
    checklist,
    calculateProgress,
    handleItemCheck,
    handleStatusChange,
    getCategoryProgress,
    getAISuggestions,
    addCustomItem
  };
};
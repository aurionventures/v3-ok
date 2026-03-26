import React, { useState } from "react";
import { Upload, X, FileText, Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CouncilDocument, DocumentCategory, DocumentTag } from "@/types/annualSchedule";

interface DocumentUploadWithTagsProps {
  documents: CouncilDocument[];
  onDocumentAdd: (document: Omit<CouncilDocument, 'id'>) => void;
  onDocumentRemove: (documentId: string) => void;
}

const documentCategories: DocumentCategory[] = [
  "Relatório",
  "Proposta", 
  "Análise",
  "Apresentação",
  "Ata",
  "Regulamento",
  "Outros"
];

const predefinedTags: DocumentTag[] = [
  { id: "urgent", name: "Urgente", color: "bg-red-500" },
  { id: "confidential", name: "Confidencial", color: "bg-yellow-500" },
  { id: "financial", name: "Financeiro", color: "bg-green-500" },
  { id: "strategic", name: "Estratégico", color: "bg-blue-500" },
  { id: "legal", name: "Jurídico", color: "bg-purple-500" },
  { id: "operational", name: "Operacional", color: "bg-orange-500" },
];

export function DocumentUploadWithTags({ 
  documents, 
  onDocumentAdd, 
  onDocumentRemove 
}: DocumentUploadWithTagsProps) {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | "">("");
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);
  const [customTag, setCustomTag] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedCategory) return;

    Array.from(files).forEach(file => {
      const newDocument: Omit<CouncilDocument, 'id'> = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: "Usuário Atual",
        url: URL.createObjectURL(file),
        tags: selectedTags,
        category: selectedCategory,
      };
      onDocumentAdd(newDocument);
    });

    // Reset form
    setSelectedCategory("");
    setSelectedTags([]);
    event.target.value = "";
  };

  const handleTagToggle = (tag: DocumentTag) => {
    setSelectedTags(prev => {
      const exists = prev.find(t => t.id === tag.id);
      if (exists) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleAddCustomTag = () => {
    if (!customTag.trim()) return;
    
    const newTag: DocumentTag = {
      id: `custom-${Date.now()}`,
      name: customTag.trim(),
      color: "bg-gray-500"
    };
    
    setSelectedTags(prev => [...prev, newTag]);
    setCustomTag("");
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(t => t.id !== tagId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Documentos Prévios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label>Categoria do Documento</Label>
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as DocumentCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {documentCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags Selection */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {predefinedTags.map(tag => (
              <Badge
                key={tag.id}
                variant={selectedTags.find(t => t.id === tag.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                <div className={`w-2 h-2 rounded-full ${tag.color} mr-1`} />
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Custom Tag Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Tag personalizada"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
            />
            <Button size="sm" onClick={handleAddCustomTag} disabled={!customTag.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="gap-1">
                  <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                  {tag.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag.id)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Fazer Upload</Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={!selectedCategory}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
          />
          {!selectedCategory && (
            <p className="text-sm text-muted-foreground">
              Selecione uma categoria antes de fazer upload
            </p>
          )}
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <Label>Documentos Enviados</Label>
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {doc.category}
                        </Badge>
                        {doc.tags.map(tag => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            <div className={`w-2 h-2 rounded-full ${tag.color} mr-1`} />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentRemove(doc.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
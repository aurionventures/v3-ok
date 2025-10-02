import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  NodeTypes,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Person {
  id: number;
  name: string;
  age: number;
  generation: string;
  role: string;
  shareholding: string;
}

interface CustomNodeData {
  person: Person;
}

const CustomPersonNode = ({ data }: { data: CustomNodeData }) => {
  const { person } = data;
  
  const generationColors = {
    'Fundadores': '#000000', // Preto
    'Segunda Geração': '#000000', // Preto
    'Investidores': '#000000', // Preto
    'Conselheiros': '#000000', // Preto
    'Executivos': '#000000' // Preto
  };

  const bgColor = generationColors[person.generation as keyof typeof generationColors] || 'hsl(var(--muted))';

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Card className="min-w-[200px] shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{person.name}</h3>
              <p className="text-xs text-black truncate">{person.role}</p>
              <div className="flex items-center justify-between mt-1">
                <Badge 
                  className="text-xs px-2 py-0 border-0"
                  style={{ backgroundColor: bgColor + '20', color: bgColor }}
                >
                  {person.generation}
                </Badge>
              </div>
              <div className="mt-1">
                <span className="text-xs font-medium text-black">Participação Societária: {person.shareholding}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  person: CustomPersonNode,
};

interface FamilyNetworkGraphProps {
  members: Person[];
}

const FamilyNetworkGraph: React.FC<FamilyNetworkGraphProps> = ({ members }) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = members.map((member, index) => {
      // Position based on generation and index
      const generationOrder = ['Fundadores', 'Segunda Geração', 'Investidores', 'Conselheiros', 'Executivos'];
      const genIndex = generationOrder.indexOf(member.generation);
      const y = genIndex * 200 + 100;
      
      // Distribute horizontally within generation
      const membersInGeneration = members.filter(m => m.generation === member.generation);
      const indexInGeneration = membersInGeneration.indexOf(member);
      const totalInGeneration = membersInGeneration.length;
      const x = (indexInGeneration - totalInGeneration / 2) * 250 + 400;

      return {
        id: member.id.toString(),
        type: 'person',
        position: { x, y },
        data: { person: member },
        draggable: true,
      };
    });

    const edges: Edge[] = [];
    
    // Create family connections (Fundadores -> Segunda Geração)
    const founders = members.filter(m => m.generation === 'Fundadores');
    const secondGen = members.filter(m => m.generation === 'Segunda Geração');
    
    founders.forEach(founder => {
      secondGen.forEach(child => {
        edges.push({
          id: `family-${founder.id}-${child.id}`,
          source: founder.id.toString(),
          target: child.id.toString(),
          type: 'default',
          style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
          label: 'Família',
          labelStyle: { fontSize: '10px', fill: 'hsl(var(--primary))' },
        });
      });
    });

    // Create hierarchical connections (CEO -> Directors)
    const ceo = members.find(m => m.role.includes('CEO'));
    const directors = members.filter(m => m.role.includes('Diretor'));
    
    if (ceo) {
      directors.forEach(director => {
        edges.push({
          id: `hierarchy-${ceo.id}-${director.id}`,
          source: ceo.id.toString(),
          target: director.id.toString(),
          type: 'default',
          style: { stroke: 'hsl(var(--secondary))', strokeWidth: 2, strokeDasharray: '5,5' },
          label: 'Hierarquia',
          labelStyle: { fontSize: '10px', fill: 'hsl(var(--secondary))' },
        });
      });
    }

    // Create board connections (Investidores e Conselheiros -> Board)
    const boardMembers = members.filter(m => 
      m.generation === 'Investidores' || m.generation === 'Conselheiros'
    );
    const executives = members.filter(m => 
      m.role.includes('CEO') || m.role.includes('CFO')
    );

    boardMembers.forEach(boardMember => {
      executives.forEach(exec => {
        if (boardMember.id !== exec.id) {
          edges.push({
            id: `board-${boardMember.id}-${exec.id}`,
            source: boardMember.id.toString(),
            target: exec.id.toString(),
            type: 'default',
            style: { stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '2,2' },
            label: 'Conselho',
            labelStyle: { fontSize: '10px', fill: 'hsl(var(--accent))' },
          });
        }
      });
    });

    return { nodes, edges };
  }, [members]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(() => {
    // Prevent new connections in this view
  }, []);

  return (
    <div className="w-full h-[600px] bg-background border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        className="bg-background"
      >
        <Background 
          color="hsl(var(--muted))" 
          gap={20} 
          size={1}
        />
        <Controls 
          className="bg-background border border-border rounded-lg shadow-sm"
          showInteractive={false}
        />
        <MiniMap 
          className="bg-background border border-border rounded-lg shadow-sm" 
          maskColor="hsl(var(--muted) / 0.1)"
          nodeColor="hsl(var(--primary))"
        />
      </ReactFlow>
    </div>
  );
};

export default FamilyNetworkGraph;
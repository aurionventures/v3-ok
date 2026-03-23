import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { FamilyMember } from "@/types/familyStructure";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 120;
const LEVEL_GAP = 180;
const NODE_GAP = 48;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getGenerationOrder(gen: string | null): number {
  if (!gen) return 99;
  const m = gen.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 99;
}

interface FamilyMemberNodeData {
  label?: string;
  member: FamilyMember;
}

function FamilyMemberNode({ data }: NodeProps<FamilyMemberNodeData>) {
  const { member } = data;
  const initials = getInitials(member.name);

  return (
    <div className="rounded-lg border border-gray-200 bg-card p-3 shadow-sm min-w-[200px]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-legacy-500/20 text-legacy-600 text-sm font-semibold">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground truncate">{member.name}</p>
          {(member.role || member.involvement) && (
            <p className="text-xs text-muted-foreground truncate">
              {[member.role, member.involvement].filter(Boolean).join(" • ")}
            </p>
          )}
          {member.generation && (
            <span className="mt-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
              {member.generation} Geração
            </span>
          )}
          {member.shareholding && (
            <p className="mt-1 text-xs text-muted-foreground">
              Participação: {member.shareholding}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = { familyMember: FamilyMemberNode };

function membersToFlow(members: FamilyMember[]): { nodes: Node[]; edges: Edge[] } {
  if (members.length === 0) return { nodes: [], edges: [] };

  const byGen = new Map<number, FamilyMember[]>();
  for (const m of members) {
    const order = getGenerationOrder(m.generation);
    if (!byGen.has(order)) byGen.set(order, []);
    byGen.get(order)!.push(m);
  }

  const sortedGens = Array.from(byGen.keys()).sort((a, b) => a - b);
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const prevLevelNodes: string[] = [];

  for (let level = 0; level < sortedGens.length; level++) {
    const list = byGen.get(sortedGens[level])!;
    const count = list.length;
    const totalWidth = (count - 1) * (NODE_WIDTH + NODE_GAP);
    const startX = -totalWidth / 2;
    const y = level * (NODE_HEIGHT + LEVEL_GAP);
    const currIds: string[] = [];

    for (let i = 0; i < count; i++) {
      const m = list[i];
      const x = startX + i * (NODE_WIDTH + NODE_GAP);
      const id = m.id;
      currIds.push(id);
      nodes.push({
        id,
        type: "familyMember",
        position: { x, y },
        data: { member: m },
      });

      if (prevLevelNodes.length > 0) {
        const parentIdx = Math.floor((i / count) * prevLevelNodes.length);
        const parentId = prevLevelNodes[Math.min(parentIdx, prevLevelNodes.length - 1)];
        edges.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
        });
      }
    }
    prevLevelNodes.length = 0;
    prevLevelNodes.push(...currIds);
  }

  return { nodes, edges };
}

interface FamilyTreeFlowProps {
  members: FamilyMember[];
}

export function FamilyTreeFlow({ members }: FamilyTreeFlowProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => membersToFlow(members),
    [members]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    const { nodes: n, edges: e } = membersToFlow(members);
    setNodes(n);
    setEdges(e);
  }, [members, setNodes, setEdges]);

  if (members.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50">
        <p className="text-muted-foreground">Nenhum familiar para exibir na árvore.</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-lg border border-gray-200 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="rounded-lg border border-gray-200"
        />
      </ReactFlow>
    </div>
  );
}

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MindMapData } from "@/types";

interface MindMapProps {
  data: MindMapData;
  imageUrl?: string | null;
}

interface TreeNode {
  id: string;
  label: string;
  color: string;
  size: "lg" | "md" | "sm";
  children: TreeNode[];
}

function buildTree(data: MindMapData): TreeNode | null {
  if (!data?.nodes?.length) return null;
  const root = data.nodes.find((n) => n.size === "lg") ?? data.nodes[0];

  function getChildren(parentId: string): TreeNode[] {
    return data.edges
      .filter((e) => e.from === parentId)
      .map((edge) => {
        const node = data.nodes.find((n) => n.id === edge.to);
        if (!node) return null;
        return {
          id: node.id,
          label: node.label.replace(/\n/g, " "),
          color: node.color ?? "#D4AF37",
          size: node.size ?? "sm",
          children: getChildren(node.id),
        };
      })
      .filter(Boolean) as TreeNode[];
  }

  return {
    id: root.id,
    label: root.label.replace(/\n/g, " "),
    color: root.color ?? "#D4AF37",
    size: "lg",
    children: getChildren(root.id),
  };
}

// Calcula posiciones radiales para los nodos hijos
function getRadialPosition(
  index: number,
  total: number,
  radius: number,
  centerX: number,
  centerY: number,
  startAngle: number = -Math.PI / 2,
  spread: number = Math.PI * 2
): { x: number; y: number } {
  const angle = startAngle + (index / Math.max(total, 1)) * spread + spread / total / 2;
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
  };
}

export function MindMap({ data, imageUrl }: MindMapProps) {
  const tree = useMemo(() => buildTree(data), [data]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  if (!tree) {
    if (imageUrl) {
      return (
        <div className="rounded-2xl overflow-hidden border border-border-subtle">
          <img src={imageUrl} alt="Mapa conceptual" className="w-full" />
        </div>
      );
    }
    return <p className="text-text-muted text-sm">Mapa conceptual no disponible.</p>;
  }

  function toggleNode(id: string) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function expandAll() {
    const allIds = new Set<string>();
    function collect(node: TreeNode) {
      if (node.children.length > 0) allIds.add(node.id);
      node.children.forEach(collect);
    }
    if (tree) collect(tree);
    setExpandedNodes(allIds);
  }

  function collapseAll() {
    setExpandedNodes(new Set());
  }

  // Dimensiones del canvas
  const W = 900;
  const H = 700;
  const CX = W / 2;
  const CY = H / 2;
  const R1 = 200; // radio primer nivel
  const R2 = 120; // radio segundo nivel desde el padre

  const level1 = tree.children;
  const level1Positions = level1.map((_, i) =>
    getRadialPosition(i, level1.length, R1, CX, CY)
  );

  return (
    <div className="space-y-3">
      {/* Controles */}
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={expandAll}
          className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.06] text-text-secondary hover:text-text-primary border border-border-subtle cursor-pointer transition-colors"
        >
          Expandir todo
        </button>
        <button
          onClick={collapseAll}
          className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.06] text-text-secondary hover:text-text-primary border border-border-subtle cursor-pointer transition-colors"
        >
          Colapsar
        </button>
      </div>

      {/* Mapa */}
      <div
        ref={containerRef}
        className="rounded-2xl border border-border-subtle bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden"
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ minHeight: 350 }}
        >
          <defs>
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Lineas nivel 1: centro -> hijos */}
          {level1.map((child, i) => {
            const pos = level1Positions[i];
            return (
              <motion.path
                key={`line-${child.id}`}
                d={`M ${CX} ${CY} Q ${(CX + pos.x) / 2} ${CY} ${pos.x} ${pos.y}`}
                stroke={`${child.color}30`}
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            );
          })}

          {/* Lineas nivel 2: padre -> sub-hijos (solo si expandido) */}
          {level1.map((child, i) => {
            if (!expandedNodes.has(child.id) || child.children.length === 0) return null;
            const parentPos = level1Positions[i];
            const parentAngle = Math.atan2(parentPos.y - CY, parentPos.x - CX);
            const spreadAngle = Math.PI * 0.6;
            const startAngle = parentAngle - spreadAngle / 2;

            return child.children.map((sub, j) => {
              const subPos = getRadialPosition(
                j, child.children.length, R2,
                parentPos.x, parentPos.y,
                startAngle, spreadAngle
              );
              return (
                <motion.path
                  key={`line-sub-${sub.id}`}
                  d={`M ${parentPos.x} ${parentPos.y} Q ${(parentPos.x + subPos.x) / 2} ${parentPos.y} ${subPos.x} ${subPos.y}`}
                  stroke={`${sub.color}25`}
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: j * 0.06 }}
                />
              );
            });
          })}

          {/* Nodos nivel 2 (sub-hijos) */}
          {level1.map((child, i) => {
            if (!expandedNodes.has(child.id) || child.children.length === 0) return null;
            const parentPos = level1Positions[i];
            const parentAngle = Math.atan2(parentPos.y - CY, parentPos.x - CX);
            const spreadAngle = Math.PI * 0.6;
            const startAngle = parentAngle - spreadAngle / 2;

            return child.children.map((sub, j) => {
              const pos = getRadialPosition(
                j, child.children.length, R2,
                parentPos.x, parentPos.y,
                startAngle, spreadAngle
              );
              return (
                <motion.g
                  key={`sub-${sub.id}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, delay: j * 0.06 }}
                >
                  <rect
                    x={pos.x - 55}
                    y={pos.y - 16}
                    width={110}
                    height={32}
                    rx={16}
                    fill={`${sub.color}12`}
                    stroke={`${sub.color}30`}
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={sub.color}
                    fontSize="10"
                    fontWeight="500"
                  >
                    {sub.label.length > 18 ? sub.label.slice(0, 16) + "..." : sub.label}
                  </text>
                </motion.g>
              );
            });
          })}

          {/* Nodos nivel 1 */}
          {level1.map((child, i) => {
            const pos = level1Positions[i];
            const isExpanded = expandedNodes.has(child.id);
            const hasChildren = child.children.length > 0;
            const labelLines = child.label.split(" ");
            const line1 = labelLines.slice(0, Math.ceil(labelLines.length / 2)).join(" ");
            const line2 = labelLines.slice(Math.ceil(labelLines.length / 2)).join(" ");

            return (
              <motion.g
                key={child.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                onClick={() => hasChildren && toggleNode(child.id)}
                className={hasChildren ? "cursor-pointer" : ""}
              >
                {/* Glow de fondo */}
                <ellipse
                  cx={pos.x}
                  cy={pos.y}
                  rx={72}
                  ry={36}
                  fill={`${child.color}08`}
                  filter="url(#glow)"
                />
                {/* Nodo */}
                <ellipse
                  cx={pos.x}
                  cy={pos.y}
                  rx={70}
                  ry={34}
                  fill={isExpanded ? `${child.color}20` : `${child.color}10`}
                  stroke={isExpanded ? `${child.color}60` : `${child.color}35`}
                  strokeWidth={isExpanded ? "2" : "1.5"}
                />
                {/* Texto */}
                <text
                  x={pos.x}
                  y={line2 ? pos.y - 6 : pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={child.color}
                  fontSize="11"
                  fontWeight="600"
                >
                  {line1}
                </text>
                {line2 && (
                  <text
                    x={pos.x}
                    y={pos.y + 8}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={child.color}
                    fontSize="11"
                    fontWeight="600"
                  >
                    {line2}
                  </text>
                )}
                {/* Indicador de hijos */}
                {hasChildren && !isExpanded && (
                  <g>
                    <circle
                      cx={pos.x + 56}
                      cy={pos.y - 22}
                      r={10}
                      fill={`${child.color}30`}
                    />
                    <text
                      x={pos.x + 56}
                      y={pos.y - 21}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={child.color}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      +{child.children.length}
                    </text>
                  </g>
                )}
              </motion.g>
            );
          })}

          {/* Nodo central */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {/* Anillo exterior glow */}
            <circle
              cx={CX}
              cy={CY}
              r={62}
              fill="none"
              stroke={`${tree.color}15`}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* Fondo */}
            <circle
              cx={CX}
              cy={CY}
              r={55}
              fill={`${tree.color}15`}
              stroke={`${tree.color}50`}
              strokeWidth="2"
            />
            {/* Texto */}
            {tree.label.split(" ").length <= 2 ? (
              <text
                x={CX}
                y={CY + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={tree.color}
                fontSize="13"
                fontWeight="bold"
              >
                {tree.label}
              </text>
            ) : (
              <>
                <text
                  x={CX}
                  y={CY - 7}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={tree.color}
                  fontSize="12"
                  fontWeight="bold"
                >
                  {tree.label.split(",")[0] ?? tree.label.split(" ").slice(0, 2).join(" ")}
                </text>
                <text
                  x={CX}
                  y={CY + 9}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={tree.color}
                  fontSize="12"
                  fontWeight="bold"
                >
                  {tree.label.split(",")[1]?.trim() ?? tree.label.split(" ").slice(2).join(" ")}
                </text>
              </>
            )}
          </motion.g>
        </svg>
      </div>

      <p className="text-xs text-text-muted text-center">
        Toca los nodos con <span className="text-accent-primary">+</span> para expandir sus conceptos
      </p>
    </div>
  );
}

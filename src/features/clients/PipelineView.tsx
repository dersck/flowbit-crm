import { useState } from 'react';
import type { Client } from '@/types';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    defaultDropAnimationSideEffects,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, GripVertical, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CLIENT_STAGE_ORDER, PIPELINE_STAGE_CONFIG, STAGE_CONFIG } from './clientConstants';
import PipelineColumnShell from './PipelineColumnShell';

interface PipelineViewProps {
    clients: Client[];
    onUpdateStage: (id: string, stage: Client['stage']) => void;
}

function SortableItem({ client }: { client: Client }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: client.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        touchAction: 'none' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group cursor-default select-none rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md",
                isDragging && "z-50 opacity-50 ring-2 ring-emerald-500 ring-offset-2"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h4 className="truncate font-black tracking-tight text-slate-900">{client.name}</h4>
                    {client.company ? (
                        <p className="mt-1 flex items-center gap-1 truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <Building2 className="h-3 w-3" />
                            {client.company}
                        </p>
                    ) : null}
                </div>
                <div
                    {...attributes}
                    {...listeners}
                    className="-m-1 cursor-grab p-1 text-slate-300 transition-colors hover:text-slate-600 active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            </div>

            {client.budget || client.contact.phone ? (
                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                    {client.budget ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                            <Landmark className="h-3 w-3" />
                            <span className="text-[11px] font-black">${client.budget.toLocaleString()}</span>
                        </div>
                    ) : (
                        <div />
                    )}

                    {client.contact.phone ? (
                        <span className="text-[10px] font-mono text-slate-400">{client.contact.phone}</span>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

function DroppableColumn({
    stage,
    clients,
    activeId,
}: {
    stage: Client['stage'];
    clients: Client[];
    activeId: string | null;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: stage });
    const totalBudget = clients.reduce((sum, client) => sum + (client.budget || 0), 0);
    const config = STAGE_CONFIG[stage];
    const columnConfig = PIPELINE_STAGE_CONFIG[stage];

    return (
        <PipelineColumnShell
            label={config.label}
            leadCount={clients.length}
            totalBudget={totalBudget}
            icon={config.icon}
            colorClassName={columnConfig.color}
            activeId={activeId}
            isOver={isOver}
            isWonStage={stage === 'ganado'}
            bodyRef={setNodeRef}
        >
            <SortableContext
                id={stage}
                items={clients.map((client) => client.id)}
                strategy={verticalListSortingStrategy}
            >
                {clients.map((client) => (
                    <SortableItem key={client.id} client={client} />
                ))}
                {clients.length === 0 && !activeId ? (
                    <div className="flex flex-1 items-center justify-center rounded-[2rem] border border-dashed border-slate-100 bg-slate-50/30 p-8 text-center">
                        <p className="leading-relaxed text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Arrastra aqui para
                            <br />
                            mover a {config.label}
                        </p>
                    </div>
                ) : null}
                {activeId && clients.length === 0 ? (
                    <div
                        className={cn(
                            "flex-1 rounded-[2rem] border-2 border-dashed transition-all",
                            isOver ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 bg-slate-50/10"
                        )}
                    />
                ) : null}
            </SortableContext>
        </PipelineColumnShell>
    );
}

export default function PipelineView({ clients, onUpdateStage }: PipelineViewProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeClient = clients.find((client) => client.id === active.id);
        const overId = over.id as string;
        const targetStage = CLIENT_STAGE_ORDER.find((stage) => stage === overId);
        const overClient = clients.find((client) => client.id === overId);
        const finalStage = targetStage || overClient?.stage;

        if (activeClient && finalStage && activeClient.stage !== finalStage) {
            onUpdateStage(activeClient.id, finalStage);
        }
    };

    const activeClient = clients.find((client) => client.id === activeId);

    return (
        <div className="scrollbar-hide flex min-h-[700px] items-start gap-6 overflow-x-auto px-1 pb-8">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {CLIENT_STAGE_ORDER.map((stage) => (
                    <DroppableColumn
                        key={stage}
                        stage={stage}
                        clients={clients.filter((client) => client.stage === stage)}
                        activeId={activeId}
                    />
                ))}

                <DragOverlay
                    dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: {
                                    opacity: '0.5',
                                },
                            },
                        }),
                    }}
                >
                    {activeClient ? (
                        <div className="z-[9999] w-80 rotate-2 scale-105 rounded-3xl border border-emerald-200 bg-white p-5 shadow-2xl">
                            <h4 className="truncate font-black tracking-tight text-slate-900">{activeClient.name}</h4>
                            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {activeClient.company || 'Sin empresa'}
                            </p>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 opacity-50">
                                {activeClient.budget ? (
                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                        <Landmark className="h-3 w-3" />
                                        <span className="text-[11px] font-black">${activeClient.budget.toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

import { useState } from 'react';
import type { Client } from '@/types';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
    useDroppable
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import {
    UserPlus,
    MessageSquare,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Building2,
    Landmark,
    GripVertical
} from 'lucide-react';

interface PipelineViewProps {
    clients: Client[];
    onUpdateStage: (id: string, stage: Client['stage']) => void;
}

const STAGES: { id: Client['stage']; label: string; icon: any; color: string }[] = [
    { id: 'nuevo', label: 'Nuevo Lead', icon: UserPlus, color: 'border-blue-200 bg-blue-50/50' },
    { id: 'contactado', label: 'Contactado', icon: MessageSquare, color: 'border-emerald-200 bg-emerald-50/50' },
    { id: 'negociacion', label: 'Negociación', icon: TrendingUp, color: 'border-amber-200 bg-amber-50/50' },
    { id: 'ganado', label: 'Ganado', icon: CheckCircle2, color: 'border-slate-900 bg-slate-900/5' },
    { id: 'perdido', label: 'Perdido', icon: XCircle, color: 'border-rose-200 bg-rose-50/50' },
];

function SortableItem({ client }: { client: Client }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: client.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        touchAction: 'none'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-default select-none",
                isDragging && "opacity-50 ring-2 ring-emerald-500 ring-offset-2 z-50"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 truncate tracking-tight">{client.name}</h4>
                    {client.company && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mt-1 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {client.company}
                        </p>
                    )}
                </div>
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 transition-colors p-1 -m-1"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            </div>

            {(client.budget || client.contact.phone) && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    {client.budget ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                            <Landmark className="h-3 w-3" />
                            <span className="text-[11px] font-black">${client.budget.toLocaleString()}</span>
                        </div>
                    ) : <div />}

                    {client.contact.phone && (
                        <span className="text-[10px] font-mono text-slate-400">{client.contact.phone}</span>
                    )}
                </div>
            )}
        </div>
    );
}

function DroppableColumn({ stage, clients, activeId }: { stage: typeof STAGES[0], clients: Client[], activeId: string | null }) {
    const { setNodeRef, isOver } = useDroppable({
        id: stage.id,
    });

    const totalBudget = clients.reduce((sum, c) => sum + (c.budget || 0), 0);

    return (
        <div className="flex-shrink-0 w-80 flex flex-col gap-4 h-full">
            {/* Column Header */}
            <div className={cn(
                "p-6 rounded-[2rem] border transition-all",
                stage.id === 'ganado' ? (isOver ? 'bg-slate-800 border-slate-800 text-white' : stage.color) : (isOver ? 'bg-white shadow-lg border-emerald-500 scale-[1.02]' : stage.color)
            )}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <stage.icon className="h-4 w-4 text-slate-900" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 tracking-tight leading-none">{stage.label}</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {clients.length} {clients.length === 1 ? 'Lead' : 'Leads'}
                            </p>
                        </div>
                    </div>
                </div>
                {totalBudget > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-950/5 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total proyectado</span>
                        <span className="text-xs font-black text-slate-900">${totalBudget.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {/* Column Content */}
            <SortableContext
                id={stage.id}
                items={clients.map(c => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={cn(
                        "flex-1 flex flex-col gap-3 min-h-[400px] rounded-[2.5rem] p-2 transition-all duration-300",
                        activeId && !isOver && "bg-slate-50/50 outline-2 outline-dashed outline-slate-200",
                        isOver && "bg-emerald-50/50 outline-2 outline-dashed outline-emerald-300 ring-4 ring-emerald-500/5",
                        stage.id === 'ganado' && isOver && "bg-slate-900/5 outline-slate-900"
                    )}
                >
                    {clients.map(client => (
                        <SortableItem key={client.id} client={client} />
                    ))}
                    {clients.length === 0 && !activeId && (
                        <div className="flex-1 flex items-center justify-center p-8 text-center bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Arrastra aquí para<br />mover a {stage.label}</p>
                        </div>
                    )}
                    {activeId && clients.length === 0 && (
                        <div className={cn(
                            "flex-1 rounded-[2rem] border-2 border-dashed transition-all",
                            isOver ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 bg-slate-50/10"
                        )} />
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

export default function PipelineView({ clients, onUpdateStage }: PipelineViewProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // Reduced from 8 for more responsiveness
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

        const activeClient = clients.find(c => c.id === active.id);
        const overId = over.id as string;

        // Check if dropped directly on a column header ID or a column container ID
        const targetStage = STAGES.find(s => s.id === overId)?.id;

        // If dropped on another item, targetStage is null, so find that item's stage
        const overClient = clients.find(c => c.id === overId);
        const finalStage = targetStage || overClient?.stage;

        if (activeClient && finalStage && activeClient.stage !== finalStage) {
            onUpdateStage(activeClient.id, finalStage);
        }
    };

    const activeClient = clients.find(c => c.id === activeId);

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 min-h-[700px] scrollbar-hide px-1 items-start">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {STAGES.map((stage) => {
                    const stageClients = clients.filter(c => c.stage === stage.id);
                    return (
                        <DroppableColumn
                            key={stage.id}
                            stage={stage}
                            clients={stageClients}
                            activeId={activeId}
                        />
                    );
                })}

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activeClient ? (
                        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-2xl w-80 scale-105 rotate-2 z-[9999]">
                            <h4 className="font-black text-slate-900 truncate tracking-tight">{activeClient.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mt-1">
                                {activeClient.company || 'Sin empresa'}
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between opacity-50">
                                {activeClient.budget ? (
                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                        <Landmark className="h-3 w-3" />
                                        <span className="text-[11px] font-black">${activeClient.budget.toLocaleString()}</span>
                                    </div>
                                ) : <div />}
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

'use client';

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartsProps {
    byStatus: Array<{ name: string; count: number }>;
    byPriority: Array<{ name: string; count: number }>;
    byType: Array<{ name: string; count: number }>;
    byTeam: Array<{ name: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
    'New': '#3b82f6',
    'In Progress': '#f97316',
    'Repaired': '#10b981',
    'Scrap': '#ef4444'
};

const PRIORITY_COLORS: Record<string, string> = {
    'Low': '#94a3b8',
    'Medium': '#f59e0b',
    'High': '#f97316',
    'Critical': '#dc2626'
};

const TYPE_COLORS: Record<string, string> = {
    'Corrective': '#ef4444',
    'Preventive': '#3b82f6',
};

export function Charts({ byStatus, byPriority, byType, byTeam }: ChartsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Bar Chart */}
                <Card className="border-slate-200 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900">By Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={byStatus}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <YAxis
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {byStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#64748b'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Priority Pie Chart */}
                <Card className="border-slate-200 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900">By Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={byPriority}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {byPriority.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#64748b'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Type Donut Chart */}
                <Card className="border-slate-200 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900">Breakdown vs Preventive</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={byType}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {byType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.name] || '#8b5cf6'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Team Performance Chart */}
            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">Requests by Team</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={byTeam} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32} fill="#6366f1">
                                {byTeam.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={'#6366f1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

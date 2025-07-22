
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReservations } from "../../hooks/useReservations";
import { useSpaces } from "../../hooks/useSpaces";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Users, Building2 } from "lucide-react";

interface ReservationStatsProps {
  reservations: ReturnType<typeof useReservations>;
  spaces: ReturnType<typeof useSpaces>;
}

export const ReservationStats: React.FC<ReservationStatsProps> = ({ reservations, spaces }) => {
  // Données pour les graphiques
  const statusData = [
    { name: 'Confirmées', value: reservations.stats.confirmed, color: '#10B981' },
    { name: 'En attente', value: reservations.stats.pending, color: '#F59E0B' },
    { name: 'Annulées', value: reservations.stats.cancelled, color: '#EF4444' },
  ];

  const typeData = reservations.reservations.reduce((acc, res) => {
    const existing = acc.find(item => item.name === res.type);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: res.type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const dayReservations = reservations.reservations.filter(res => 
      res.dateTime.start.toDateString() === date.toDateString()
    ).length;
    
    return {
      day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      reservations: dayReservations
    };
  });

  const spaceUtilization = spaces.allSpaces.map(space => {
    const spaceReservations = reservations.reservations.filter(res => res.spaceId === space.id);
    return {
      name: space.name,
      utilization: (spaceReservations.length / Math.max(reservations.reservations.length, 1)) * 100,
      reservations: spaceReservations.length
    };
  });

  const COLORS = ['#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1'];

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total réservations</p>
                <p className="text-3xl font-bold">{reservations.stats.total}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% ce mois
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de confirmation</p>
                <p className="text-3xl font-bold">
                  {reservations.stats.total > 0 
                    ? Math.round((reservations.stats.confirmed / reservations.stats.total) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Excellent
                </p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Espaces utilisés</p>
                <p className="text-3xl font-bold">
                  {new Set(reservations.reservations.map(r => r.spaceId)).size}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  sur {spaces.allSpaces.length} disponibles
                </p>
              </div>
              <Building2 className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Moyenne participants</p>
                <p className="text-3xl font-bold">
                  {reservations.reservations.length > 0
                    ? Math.round(reservations.reservations.reduce((sum, r) => sum + r.participants, 0) / reservations.reservations.length)
                    : 0}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  Par réservation
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statut des réservations */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle>Réservations cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reservations" 
                  stroke="#8884D8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884D8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Utilisation des espaces */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation des espaces</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={spaceUtilization} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}%`,
                  'Taux d\'utilisation'
                ]}
              />
              <Bar dataKey="utilization" fill="#8884D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Types de réservations */}
      {typeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Types de réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82CA9D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

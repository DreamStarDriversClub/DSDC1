"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TeamData {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  contactEmail: string;
  logoUrl: string | null;
  socialLinks: Record<string, string>;
  isApproved: boolean;
  createdAt: string;
  _count?: { events: number };
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventType: string;
  eventDate: string;
  location: string;
  isApproved: boolean;
  createdAt: string;
  team?: { name: string; slug: string } | null;
}

type Tab = "teams" | "events";

const eventTypeColors: Record<string, "red" | "gold" | "info" | "warning" | "success"> = {
  meet: "red",
  track_day: "warning",
  cruise: "info",
  show: "gold",
  dyno_day: "success",
};

const eventTypeLabels: Record<string, string> = {
  meet: "Meet",
  track_day: "Track Day",
  cruise: "Cruise",
  show: "Show",
  dyno_day: "Dyno Day",
};

export function CommunityModeration() {
  const [tab, setTab] = useState<Tab>("teams");
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = useCallback(async () => {
    const res = await fetch("/api/admin/community/teams");
    const data = await res.json();
    if (data.teams) setTeams(data.teams);
  }, []);

  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/admin/community/events");
    const data = await res.json();
    if (data.events) setEvents(data.events);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTeams(), fetchEvents()]).finally(() => setLoading(false));
  }, [fetchTeams, fetchEvents]);

  async function handleTeamAction(id: string, isApproved: boolean) {
    await fetch(`/api/admin/community/teams/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });
    await fetchTeams();
  }

  async function handleEventAction(id: string, isApproved: boolean) {
    await fetch(`/api/admin/community/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });
    await fetchEvents();
  }

  const pendingTeams = teams.filter((t) => !t.isApproved);
  const approvedTeams = teams.filter((t) => t.isApproved);
  const pendingEvents = events.filter((e) => !e.isApproved);
  const approvedEvents = events.filter((e) => e.isApproved);

  if (loading) {
    return (
      <div className="py-12 text-center text-ds-gray-400">
        Loading community data...
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-white/[0.06]">
        <button
          onClick={() => setTab("teams")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "teams"
              ? "border-b-2 border-ds-red text-ds-white"
              : "text-ds-gray-400 hover:text-ds-white"
          }`}
        >
          Teams
          {pendingTeams.length > 0 && (
            <span className="ml-2 rounded-full bg-ds-red/20 px-2 py-0.5 text-[10px] font-bold text-ds-red">
              {pendingTeams.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("events")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "events"
              ? "border-b-2 border-ds-red text-ds-white"
              : "text-ds-gray-400 hover:text-ds-white"
          }`}
        >
          Events
          {pendingEvents.length > 0 && (
            <span className="ml-2 rounded-full bg-ds-red/20 px-2 py-0.5 text-[10px] font-bold text-ds-red">
              {pendingEvents.length}
            </span>
          )}
        </button>
      </div>

      {/* Teams Tab */}
      {tab === "teams" && (
        <div className="space-y-8">
          {/* Pending */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
              Pending Teams ({pendingTeams.length})
            </h3>
            {pendingTeams.length === 0 ? (
              <p className="text-sm text-ds-gray-500">No pending teams.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Name</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Location</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Contact</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Submitted</th>
                      <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTeams.map((team) => (
                      <tr key={team.id} className="border-b border-white/[0.03]">
                        <td className="py-3 pr-4 font-medium text-ds-white">{team.name}</td>
                        <td className="py-3 pr-4 text-ds-gray-400">{team.location}</td>
                        <td className="py-3 pr-4 text-ds-gray-400">{team.contactEmail}</td>
                        <td className="py-3 pr-4 text-ds-gray-500">
                          {new Date(team.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleTeamAction(team.id, true)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-ds-gray-400 hover:text-ds-red-400"
                              onClick={() => handleTeamAction(team.id, false)}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Approved */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
              Approved Teams ({approvedTeams.length})
            </h3>
            {approvedTeams.length === 0 ? (
              <p className="text-sm text-ds-gray-500">No approved teams yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Name</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Location</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Events</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Approved</th>
                      <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedTeams.map((team) => (
                      <tr key={team.id} className="border-b border-white/[0.03]">
                        <td className="py-3 pr-4 font-medium text-ds-white">{team.name}</td>
                        <td className="py-3 pr-4 text-ds-gray-400">{team.location}</td>
                        <td className="py-3 pr-4 text-ds-gray-400">{team._count?.events ?? 0}</td>
                        <td className="py-3 pr-4">
                          <Badge variant="success" size="sm">Approved</Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-ds-gray-400 hover:text-ds-red-400"
                            onClick={() => handleTeamAction(team.id, false)}
                          >
                            Revoke
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {tab === "events" && (
        <div className="space-y-8">
          {/* Pending */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
              Pending Events ({pendingEvents.length})
            </h3>
            {pendingEvents.length === 0 ? (
              <p className="text-sm text-ds-gray-500">No pending events.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Title</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Type</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Date</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Host</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Location</th>
                      <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEvents.map((event) => (
                      <tr key={event.id} className="border-b border-white/[0.03]">
                        <td className="py-3 pr-4 font-medium text-ds-white">{event.title}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={eventTypeColors[event.eventType] ?? "gray"} size="sm">
                            {eventTypeLabels[event.eventType] ?? event.eventType}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-ds-gray-400">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-ds-gray-400">
                          {event.team?.name ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-ds-gray-400">{event.location}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleEventAction(event.id, true)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-ds-gray-400 hover:text-ds-red-400"
                              onClick={() => handleEventAction(event.id, false)}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Approved */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
              Approved Events ({approvedEvents.length})
            </h3>
            {approvedEvents.length === 0 ? (
              <p className="text-sm text-ds-gray-500">No approved events yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Title</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Type</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Date</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Host</th>
                      <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">Location</th>
                      <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedEvents.map((event) => (
                      <tr key={event.id} className="border-b border-white/[0.03]">
                        <td className="py-3 pr-4 font-medium text-ds-white">{event.title}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={eventTypeColors[event.eventType] ?? "gray"} size="sm">
                            {eventTypeLabels[event.eventType] ?? event.eventType}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-ds-gray-400">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-ds-gray-400">
                          {event.team?.name ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-ds-gray-400">{event.location}</td>
                        <td className="py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-ds-gray-400 hover:text-ds-red-400"
                            onClick={() => handleEventAction(event.id, false)}
                          >
                            Revoke
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

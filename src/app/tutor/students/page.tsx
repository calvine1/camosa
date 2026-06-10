"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Mail,
  BookOpen,
  Ban,
  CheckCircle2,
  User,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  loadLearners,
  setEnrollmentStatus,
  getLearnerSummary,
  type Learner,
  type LearnerEnrollment,
  type EnrollmentStatus,
} from "@/lib/tutor/learners";
import { cn } from "@/lib/utils";

function statusBadgeClass(status: EnrollmentStatus) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-500";
    case "suspended":
      return "bg-amber-500/15 text-amber-600";
    default:
      return "bg-blue-500/10 text-blue-500";
  }
}

function EnrollmentCard({
  enrollment,
  onSuspend,
  onReinstate,
}: {
  enrollment: LearnerEnrollment;
  onSuspend: (id: string) => void;
  onReinstate: (id: string) => void;
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-background/50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h4 className="font-extrabold text-foreground text-sm">{enrollment.courseTitle}</h4>
          <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Last active: {enrollment.lastActive}
          </p>
        </div>
        <Badge
          className={cn(
            "font-black text-[9px] uppercase tracking-wider border-none shrink-0",
            statusBadgeClass(enrollment.status)
          )}
        >
          {enrollment.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>
            {enrollment.lecturesCompleted} of {enrollment.lecturesTotal} lessons
          </span>
          <span>{enrollment.progress}%</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              enrollment.status === "suspended" ? "bg-amber-500" : "bg-primary"
            )}
            style={{ width: `${enrollment.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {enrollment.status !== "suspended" && enrollment.status !== "completed" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full font-bold text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
            onClick={() => onSuspend(enrollment.id)}
          >
            <Ban className="w-4 h-4 mr-1.5" />
            Suspend on course
          </Button>
        )}
        {enrollment.status === "suspended" && (
          <Button
            type="button"
            size="sm"
            className="rounded-full font-bold"
            onClick={() => onReinstate(enrollment.id)}
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Reinstate access
          </Button>
        )}
      </div>
    </div>
  );
}

export default function TutorStudents() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    const data = loadLearners();
    setLearners(data);
    if (data.length > 0) setSelectedId(data[0].id);
  }, []);

  const filteredLearners = useMemo(
    () =>
      learners.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.enrollments.some((e) =>
            e.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
          )
      ),
    [learners, searchQuery]
  );

  const selectedLearner = learners.find((l) => l.id === selectedId) ?? null;

  const handleStatusChange = (
    enrollmentId: string,
    status: EnrollmentStatus,
    courseTitle: string,
    learnerName: string
  ) => {
    setLearners(setEnrollmentStatus(enrollmentId, status));
    setActionMsg(
      status === "suspended"
        ? `${learnerName} suspended on "${courseTitle}".`
        : `${learnerName} reinstated on "${courseTitle}".`
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="pb-6 border-b border-border">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Learner Management
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Select a learner to review course progress or suspend access on a course.
        </p>
      </div>

      {actionMsg && (
        <p className="text-sm font-semibold text-emerald-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {actionMsg}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <Input
              placeholder="Search learners or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card border-border"
            />
          </div>

          <Card className="border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold">Learners</CardTitle>
              <CardDescription>Click a learner to view details</CardDescription>
            </CardHeader>
            <CardContent className="p-0 max-h-[520px] overflow-y-auto">
              {filteredLearners.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground font-semibold">
                  No learners match your search.
                </p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {filteredLearners.map((learner) => {
                    const summary = getLearnerSummary(learner);
                    const isSelected = learner.id === selectedId;
                    return (
                      <li key={learner.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(learner.id);
                            setActionMsg(null);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-3.5 flex items-center gap-3 transition-colors hover:bg-secondary/30",
                            isSelected && "bg-primary/5 border-l-2 border-l-primary"
                          )}
                        >
                          <div className="w-10 h-10 rounded-full bg-secondary border border-border overflow-hidden shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${learner.avatarSeed}`}
                              alt={learner.name}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-extrabold text-sm text-foreground truncate">
                              {learner.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-semibold truncate">
                              {learner.enrollments.length} course
                              {learner.enrollments.length !== 1 ? "s" : ""} · {summary.avgProgress}%
                              avg
                            </p>
                          </div>
                          {summary.suspended > 0 && (
                            <Badge className="bg-amber-500/15 text-amber-600 border-none text-[9px] font-black uppercase shrink-0">
                              {summary.suspended} suspended
                            </Badge>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {selectedLearner ? (
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="border-b border-border/60">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary border border-border overflow-hidden shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedLearner.avatarSeed}`}
                      alt={selectedLearner.name}
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <CardTitle className="text-xl font-extrabold">
                      {selectedLearner.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 font-semibold">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedLearner.email}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Joined {selectedLearner.joinedDate}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Courses",
                      value: selectedLearner.enrollments.length,
                      icon: BookOpen,
                      color: "text-blue-500",
                    },
                    {
                      label: "Avg progress",
                      value: `${getLearnerSummary(selectedLearner).avgProgress}%`,
                      icon: User,
                      color: "text-primary",
                    },
                    {
                      label: "Suspended",
                      value: getLearnerSummary(selectedLearner).suspended,
                      icon: AlertTriangle,
                      color: "text-amber-500",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-xl border border-border bg-background/40 text-center"
                    >
                      <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {stat.label}
                      </p>
                      <p className="text-lg font-black text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-foreground text-sm">Course progress</h3>
                  {selectedLearner.enrollments.map((enrollment) => (
                    <EnrollmentCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      onSuspend={(id) =>
                        handleStatusChange(
                          id,
                          "suspended",
                          enrollment.courseTitle,
                          selectedLearner.name
                        )
                      }
                      onReinstate={(id) =>
                        handleStatusChange(
                          id,
                          "active",
                          enrollment.courseTitle,
                          selectedLearner.name
                        )
                      }
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-card p-10 text-center">
              <p className="text-muted-foreground font-semibold">
                Select a learner from the list to view progress and manage course access.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

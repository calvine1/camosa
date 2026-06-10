export type EnrollmentStatus = "active" | "suspended" | "completed";

export type LearnerEnrollment = {
  id: string;
  courseTitle: string;
  lastActive: string;
  status: EnrollmentStatus;
  lecturesCompleted: number;
  lecturesTotal: number;
  progress: number; // 0-100
};

export type Learner = {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  avatarSeed: string;
  enrollments: LearnerEnrollment[];
};


let learnersState: Learner[] = [];

export function loadLearners(): Learner[] {
  // Return a new reference so React state updates 
  return structuredClone(learnersState);
}

export function setEnrollmentStatus(
  enrollmentId: string,
  status: EnrollmentStatus
): Learner[] {
  learnersState = learnersState.map((learner) => {
    return {
      ...learner,
      enrollments: learner.enrollments.map((enr) => {
        if (enr.id !== enrollmentId) return enr;
        const next: LearnerEnrollment = {
          ...enr,
          status,
          lastActive: status === "suspended" ? "—" : "just now",
        };

        if (status === "completed") {
          next.progress = 100;
          next.lecturesCompleted = next.lecturesTotal;
        }

        if (status === "active") {
          
        }

        return next;
      }),
    };
  });

  return structuredClone(learnersState);
}

export function getLearnerSummary(learner: Learner): {
  avgProgress: number;
  suspended: number;
} {
  const enrollments = learner.enrollments;
  const total = enrollments.reduce((acc, e) => acc + (Number.isFinite(e.progress) ? e.progress : 0), 0);
  const avgProgress = enrollments.length ? Math.round(total / enrollments.length) : 0;
  const suspended = enrollments.filter((e) => e.status === "suspended").length;

  return { avgProgress, suspended };
}


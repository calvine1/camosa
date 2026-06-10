export type TutorStaffRole = "tutor" | "admin" | "board_member";

export const TUTOR_STAFF_ROLES: {
  value: TutorStaffRole;
  label: string;
  description: string;
}[] = [
  {
    value: "tutor",
    label: "Tutor",
    description: "Manage courses, learners, and session content.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Full portal access including learner suspension and settings.",
  },
  {
    value: "board_member",
    label: "Board member",
    description: "Oversight access for accreditation and program review.",
  },
];

export function getTutorStaffRole(
  metadata: Record<string, unknown> | undefined
): TutorStaffRole {
  const role = metadata?.staff_role;
  if (role === "admin" || role === "board_member" || role === "tutor") {
    return role;
  }
  return "tutor";
}

export function getTutorStaffLabel(role: TutorStaffRole) {
  return TUTOR_STAFF_ROLES.find((r) => r.value === role)?.label ?? "Tutor";
}

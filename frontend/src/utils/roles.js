export const ROLES = {
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
  COORDINATOR: "student",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Event Organizer",
  [ROLES.FACULTY]: "Faculty",
  [ROLES.STUDENT]: "Student",
};

export const roleHomePath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/dashboard/admin";
    case ROLES.FACULTY:
      return "/dashboard/faculty";
    case ROLES.STUDENT:
    case "coordinator":
      return "/dashboard/coordinator";
    default:
      return "/login";
  }
};

export const ROLES = {
  ADMIN: "admin",
  FACULTY: "faculty",
  COORDINATOR: "coordinator",
};

export const roleHomePath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/dashboard/admin";
    case ROLES.FACULTY:
      return "/dashboard/faculty";
    case ROLES.COORDINATOR:
      return "/dashboard/coordinator";
    default:
      return "/login";
  }
};

import {
  ChartLine,
  Person,
  Calendar,
  Star,
  GraduationCap,
  Plus,
  LayoutList,
  Comment,
  LayoutHeader,
  Persons,
  Shield,
  CircleCheck,
  CircleXmark,
  CreditCard,
  Magnifier,
} from "@gravity-ui/icons";

export const DASHBOARD_ROLES = ["user", "trainer", "admin"];

export const ROLE_LABELS = {
  user: "Member",
  trainer: "Trainer",
  admin: "Admin",
};

export const ROLE_BADGE_VARIANTS = {
  user: "default",
  trainer: "secondary",
  admin: "accent",
};

/**
 * Sidebar navigation grouped by role.
 * Each item: { label, href, icon, description? }
 */
export const SIDEBAR_NAV = {
  user: [
    {
      label: "Overview",
      href: "/dashboard/user",
      icon: ChartLine,
      description: "Your fitness dashboard summary",
    },
    {
      label: "Booked Classes",
      href: "/dashboard/user/booked-classes",
      icon: Calendar,
      description: "Classes you have enrolled in",
    },
    {
      label: "Payment History",
      href: "/dashboard/user/payments",
      icon: CreditCard,
      description: "Stripe payments and transaction records",
    },
    {
      label: "Favorites",
      href: "/dashboard/user/favorites",
      icon: Star,
      description: "Saved classes and trainers",
    },
    {
      label: "Apply as Trainer",
      href: "/dashboard/user/apply-trainer",
      icon: GraduationCap,
      description: "Submit a trainer application",
    },
    {
      label: "Profile",
      href: "/dashboard/user/profile",
      icon: Person,
      description: "Manage your account details",
    },
  ],
  trainer: [
    {
      label: "Overview",
      href: "/dashboard/trainer",
      icon: ChartLine,
      description: "Trainer performance overview",
    },
    {
      label: "Add Class",
      href: "/dashboard/trainer/add-class",
      icon: Plus,
      description: "Create a new fitness class",
    },
    {
      label: "My Classes",
      href: "/dashboard/trainer/my-classes",
      icon: LayoutList,
      description: "Manage your class catalog",
    },
    {
      label: "Add Forum Post",
      href: "/dashboard/trainer/add-forum-post",
      icon: Comment,
      description: "Share with the community",
    },
    {
      label: "My Forum Posts",
      href: "/dashboard/trainer/my-forum-posts",
      icon: LayoutHeader,
      description: "Posts you have published",
    },
    {
      label: "Profile",
      href: "/dashboard/trainer/profile",
      icon: Person,
      description: "Your trainer profile",
    },
  ],
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: ChartLine,
      description: "Platform analytics overview",
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/manage-users",
      icon: Persons,
      description: "User accounts and permissions",
    },
    {
      label: "Applied Trainers",
      href: "/dashboard/admin/applied-trainers",
      icon: GraduationCap,
      description: "Review trainer applications",
    },
    {
      label: "Manage Trainers",
      href: "/dashboard/admin/manage-trainers",
      icon: Shield,
      description: "Active trainer roster",
    },
    {
      label: "Manage Classes",
      href: "/dashboard/admin/manage-classes",
      icon: LayoutList,
      description: "Approve and moderate classes",
    },
    {
      label: "Add Forum Post",
      href: "/dashboard/admin/add-forum-post",
      icon: Plus,
      description: "Publish official announcements",
    },
    {
      label: "Forum Manage",
      href: "/dashboard/admin/forum-manage",
      icon: Comment,
      description: "Moderate community posts",
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
      description: "Payment and billing history",
    },
    {
      label: "Profile",
      href: "/dashboard/admin/profile",
      icon: Person,
      description: "Admin account settings",
    },
  ],
};

/**
 * Resolves the active nav item from pathname.
 */
export function getActiveNavItem(role, pathname) {
  const items = SIDEBAR_NAV[role] || [];
  return (
    items.find(
      (item) =>
        pathname === item.href ||
        (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href))
    ) || items[0]
  );
}

/**
 * Returns page title for dashboard top navbar.
 */
export function getDashboardPageTitle(role, pathname) {
  const active = getActiveNavItem(role, pathname);
  return active?.label || "Dashboard";
}

/**
 * Role-based dashboard home redirect path.
 */
export function getRoleDashboardPath(role) {
  if (DASHBOARD_ROLES.includes(role)) {
    return `/dashboard/${role}`;
  }
  return "/dashboard/user";
}

/**
 * Validates whether a user can access a dashboard route segment.
 */
export function canAccessDashboardRoute(userRole, pathname) {
  if (!userRole || !DASHBOARD_ROLES.includes(userRole)) return false;

  const segment = pathname.split("/")[2];
  if (!segment) return true;

  return segment === userRole;
}

export const TRAINER_APPLICATION_STATUS = {
  NONE: "none",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const STATUS_BADGE_MAP = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  active: { label: "Active", variant: "success" },
  blocked: { label: "Blocked", variant: "danger" },
  draft: { label: "Draft", variant: "default" },
  published: { label: "Published", variant: "success" },
};

export const DASHBOARD_SEARCH_PLACEHOLDER = {
  user: "Search classes, trainers...",
  trainer: "Search classes, students...",
  admin: "Search users, classes, transactions...",
};

export const ADMIN_ACTION_ICONS = {
  approve: CircleCheck,
  reject: CircleXmark,
  search: Magnifier,
};

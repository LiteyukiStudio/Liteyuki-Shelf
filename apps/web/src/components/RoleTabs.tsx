import { useTranslation } from "react-i18next";
import type { UserRole } from "@liteyuki-shelf/shared";

const roles: UserRole[] = ["reader", "author", "admin"];

interface RoleTabsProps {
  role: UserRole;
  onChange: (role: UserRole) => void;
}

export function RoleTabs({ role, onChange }: RoleTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="role-tabs">
      {roles.map((item) => (
        <button
          key={item}
          className={item === role ? "role-tab active" : "role-tab"}
          onClick={() => onChange(item)}
        >
          {t(`roles.${item}`)}
        </button>
      ))}
    </div>
  );
}

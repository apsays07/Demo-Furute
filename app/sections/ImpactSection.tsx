import {
  ChartIcon,
  BasketIcon,
  MapIcon,
  TagIcon,
} from "@/components/ui/Icons";
import styles from "./ImpactSection.module.css";

const impactStats = [
  {
    value: 11285,
    label: "Leaders Trained",
    icon: ChartIcon,
  },
  {
    value: 23695,
    label: "Counselling",
    icon: BasketIcon,
  },
  {
    value: 14275,
    label: "Lives Touched",
    icon: MapIcon,
  },
  {
    value: 7624,
    label: "Days MAD (Making A Difference)",
    icon: TagIcon,
  },
];

function ImpactStat({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <article className={styles["impact-stat"]}>
      <span className={styles["impact-stat-icon-wrap"]} aria-hidden="true">
        <Icon className={styles["impact-stat-icon"]} />
      </span>
      <strong
        className={styles["impact-stat-number"]}
        aria-label={`${value.toLocaleString()} ${label}`}
      >
        <span>{value.toLocaleString()}</span>
      </strong>
      <span className={styles["impact-stat-label"]}>{label}</span>
    </article>
  );
}

export default function ImpactSection() {
  return (
    <section className={styles["impact-stats-section"]} aria-label="Furute impact">
      <div className={styles["impact-stats-grid"]}>
        {impactStats.map((stat) => (
          <ImpactStat
            key={stat.label}
            value={stat.value}
            label={stat.label}
            icon={stat.icon}
          />
        ))}
      </div>
    </section>
  );
}

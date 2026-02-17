import { useTranslation } from "react-i18next";
import css from "./CostOfActivities.module.css";

const ACTIVITIES = [
  { id: "waterheater", kwh: 12, icon: "\u{1F6BF}" },
  { id: "sauna", kwh: 8, icon: "\u{1F9D6}" },
  { id: "dishwasher", kwh: 1.3, icon: "\u{1F37D}\uFE0F" },
  { id: "boil", kwh: 0.12, icon: "\u{1F4A7}" },
  { id: "cooking", kwh: 1.5, icon: "\u{1F373}" },
  { id: "car", kwh: 75, icon: "\u{1F697}" },
  { id: "dryer", kwh: 2.5, icon: "\u{1F321}\uFE0F" },
  { id: "washing", kwh: 0.8, icon: "\u{1F455}" },
  { id: "phone", kwh: 0.005, icon: "\u{1F4F1}" },
  { id: "fridge", kwh: 0.44, icon: "\u{1F9C0}" },
  { id: "vacuum", kwh: 1, icon: "\u{1F9F9}" },
  { id: "hairdryer", kwh: 0.33, icon: "\u{1F487}" },
];

function formatCost(costEur) {
  if (costEur < 0.005) {
    return "<0.01 \u20AC";
  }
  return costEur.toFixed(2) + " \u20AC";
}

function CostOfActivities({ avg, min, max, vat }) {
  const { t } = useTranslation();

  if (avg == null || min == null || max == null) return null;

  return (
    <div className={css.costSection}>
      <div className={css.sectionTitle}>
        {t("countryPage.costOfActivitiesTitle")}
      </div>
      <div className={css.grid}>
        {ACTIVITIES.map((activity) => {
          const avgCost = (activity.kwh * avg * vat) / 1000;
          const minCost = (activity.kwh * min * vat) / 1000;
          const maxCost = (activity.kwh * max * vat) / 1000;

          return (
            <div key={activity.id} className={css.card}>
              <div className={css.iconCircle}>{activity.icon}</div>
              <div className={css.cardContent}>
                <div className={css.cardTitle}>
                  {t(`countryPage.activity_${activity.id}`)}
                </div>
                <div className={css.mainCost}>{formatCost(avgCost)}</div>
                <div className={css.arrows}>
                  <span className={css.arrowDown}>
                    &#9660; {formatCost(minCost)}
                  </span>
                  <span className={css.arrowUp}>
                    &#9650; {formatCost(maxCost)}
                  </span>
                </div>
                <div className={css.cardDesc}>
                  {t(`countryPage.activity_${activity.id}_desc`)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CostOfActivities;

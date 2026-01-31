import { 
  CloseCircle, 
  Hourglass, 
  UsersGroupTwoRounded, 
  WalletMoney 
} from "@solar-icons/react";
import { 
  CARD, 
  CARD_INTERACTIVE, 
  cn, 
  FLEX_COL, 
  FLEX_ROW_BETWEEN 
} from "@/lib/design-utils";
import { CARD_VARIANTS, CONTAINER_PADDING, FLEX_LAYOUTS, FONT_FAMILY, GAP, GRID_LAYOUTS, TEXT_SIZE, TEXT_STYLES } from "@/constants/design-system";

interface MetricCardProps {
  title: string;
  value: string;
  trendLabel: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const MetricCard = ({ title, value, trendLabel, icon, iconBg, iconColor }: MetricCardProps) => (
  <div className={cn(CARD_VARIANTS.flat,CARD_INTERACTIVE, CONTAINER_PADDING.cardSm, FLEX_COL, )}>
    <div className={FLEX_ROW_BETWEEN}>
      <h3 className={cn(FONT_FAMILY.montserratSemibold, TEXT_STYLES.label, TEXT_SIZE.xs)}>{title}</h3>
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", iconBg)}>
        <span className={iconColor}>{icon}</span>
      </div>
    </div>
    <div className={cn(FLEX_ROW_BETWEEN, "mt-4 items-end")}>
      <span className={cn(TEXT_STYLES.body,FONT_FAMILY.montserratBold, TEXT_SIZE.base)}>{value}</span>
      <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
        <span className="text-[10px]">▲</span>
        <span>{trendLabel}</span>
      </div>
    </div>
  </div>
);

export default function ShiftMetrics() {
  return (
    <div className={cn(GRID_LAYOUTS.fourCol, GAP.responsive, 'mb-4')}>
      <MetricCard 
        title="Cancellations" 
        value="8/8" 
        trendLabel="From This Week"
        icon={<CloseCircle className="w-5 h-5" />}
        iconBg="bg-primary-50"
        iconColor="text-primary"
      />
      <MetricCard 
        title="Response Time" 
        value="32 Mins" 
        trendLabel="From This Week"
        icon={<Hourglass className="w-5 h-5" />}
        iconBg="bg-primary-50"
        iconColor="text-primary"
      />
      <MetricCard 
        title="Total Panel Workers" 
        value="47/68" 
        trendLabel="From last Week"
        icon={<UsersGroupTwoRounded className="w-5 h-5" />}
        iconBg="bg-primary-50"
        iconColor="text-primary"
      />
      <MetricCard 
        title="Estimated Savings" 
        value="$2,480" 
        trendLabel="From last Month"
        icon={<WalletMoney className="w-5 h-5" />}
        iconBg="bg-primary-50"
        iconColor="text-primary"
      />
    </div>
  );
}
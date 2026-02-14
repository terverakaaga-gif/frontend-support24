import { motion } from "framer-motion";

export const RoundedFigure = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) => {
  return (
    <motion.div
      animate={{ scale: [0, 1] }}
      className="flex justify-center items-center space-x-3 rounded-full bg-white p-3 text-sm  text-primary font-montserrat-semibold w-fit"
    >
      <Icon />
      <span>{text}</span>
    </motion.div>
  );
};

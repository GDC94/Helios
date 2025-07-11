import { motion } from "framer-motion";

type ComponentProps = Record<string, unknown>;
type ReactComponent<P = ComponentProps> = React.ComponentType<P>;
type WithTransitionComponent<P = ComponentProps> = React.FC<P>;

interface TransitionConfig {
  readonly duration: number;
  readonly ease: readonly [number, number, number, number];
}

interface TransitionElementProps {
  readonly className: string;
  readonly initial: { readonly scaleY: number };
  readonly animate: { readonly scaleY: number };
  readonly exit: { readonly scaleY: number };
  readonly transition: TransitionConfig;
}

const DEFAULT_TRANSITION_CONFIG: TransitionConfig = {
  duration: 1.4,
  ease: [0.83, 0, 0.17, 1] as const,
} as const;

/**
 * HOC
 *
 * @param Page - Componente React a envolver con la transición
 * @returns Componente envuelto con la transición
 */
const Transition = <P extends ComponentProps = ComponentProps>(
  Page: ReactComponent<P>
): WithTransitionComponent<P> => {
  const WithTransition: WithTransitionComponent<P> = (props: P) => {
    const slideOutProps: TransitionElementProps = {
      className:
        "fixed top-0 left-0 h-screen w-full bg-[#f0f6ff] pointer-events-none z-[10000] origin-top",
      initial: { scaleY: 1 },
      animate: { scaleY: 0 },
      exit: { scaleY: 0.5 },
      transition: DEFAULT_TRANSITION_CONFIG,
    } as const;

    return (
      <>
        <Page {...props} />
        <motion.div {...slideOutProps} />
      </>
    );
  };

  WithTransition.displayName = `Transition(${Page.displayName || Page.name || "Component"})`;

  return WithTransition;
};

export default Transition;

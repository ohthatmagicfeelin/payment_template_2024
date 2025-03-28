import { useLanding } from '../hooks/useLanding';
import { LandingDisplay } from './LandingDisplay';

export function LandingContainer() {
  const landingProps = useLanding();
  return <LandingDisplay {...landingProps} />;
}

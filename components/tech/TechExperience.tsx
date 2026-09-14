import {
  FLAGSHIP_SYSTEM,
  TECH,
  TECH_REGISTER,
  TECH_SYSTEM_FAMILIES,
} from "@/content/tech";
import { SystemObservatory } from "./SystemObservatory";
import { SystemSpectrum } from "./SystemSpectrum";
import { SystemState } from "./SystemState";
import { SystemsRegister } from "./SystemsRegister";
import { TechClosing } from "./TechClosing";
import { TechBoot } from "./TechBoot";
import { TechJourneyController } from "./TechJourneyController";

export function TechExperience() {
  return (
    <div
      className="tech-experience"
      data-tech-experience
      data-tech-boot="complete"
      data-tech-phase="observe"
      data-tech-direction="0"
    >
      <TechJourneyController />
      <TechBoot />
      <SystemObservatory system={FLAGSHIP_SYSTEM} tech={TECH} />
      <SystemState stateRecords={FLAGSHIP_SYSTEM.stateRecords} />
      <SystemSpectrum families={TECH_SYSTEM_FAMILIES} />
      <SystemsRegister rows={TECH_REGISTER} />
      <TechClosing tech={TECH} />
    </div>
  );
}

import {
  FLAGSHIP_SYSTEM,
  TECH,
  TECH_REGISTER,
  TECH_SYSTEM_FAMILIES,
} from "@/content/tech";
import { SERVICES } from "@/content/services";
import { SystemObservatory } from "./SystemObservatory";
import { SystemPracticeTransition } from "./SystemPracticeTransition";
import { SystemSpectrum } from "./SystemSpectrum";
import { SystemState } from "./SystemState";
import { SystemsRegister } from "./SystemsRegister";
import { TechClosing } from "./TechClosing";
import { TechBoot } from "./TechBoot";
import { TechJourneyController } from "./TechJourneyController";

export function TechExperience() {
  const legacyServiceScope = SERVICES.tech;

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
      <section className="tech-canonical-scope">
        <h2>{legacyServiceScope.headline.value}</h2>
        <p>{legacyServiceScope.supportingCopy.value}</p>
        <ul>
          {legacyServiceScope.groups.value.map((group) => (
            <li key={group}>{group}</li>
          ))}
        </ul>
      </section>
      <SystemObservatory system={FLAGSHIP_SYSTEM} tech={TECH} />
      <SystemState stateRecords={FLAGSHIP_SYSTEM.stateRecords} />
      <SystemPracticeTransition tech={TECH} />
      <SystemSpectrum families={TECH_SYSTEM_FAMILIES} />
      <SystemsRegister rows={TECH_REGISTER} />
      <TechClosing tech={TECH} />
    </div>
  );
}

import {
  DirectionalLight,
  Group,
  PointLight,
  Vector2,
} from "three";

import type { DestinationInteraction } from "../briefing.ts";
import { CreatorEntity } from "./creatorEntity.ts";
import { TechnicalEntity } from "./technicalEntity.ts";
import { VisualsEntity, type EntityUpdateParams } from "./visualsEntity.ts";

export type DestinationEntitySystemParams = {
  progress: number;
  interactions: DestinationInteraction;
  reducedMotion: boolean;
  eventDarkness: number;
};

export class DestinationEntitySystem {
  readonly group = new Group();
  readonly visuals = new VisualsEntity();
  readonly technical = new TechnicalEntity();
  readonly creator = new CreatorEntity();

  private readonly keyLight = new DirectionalLight(0xfffefc, 1.5);
  private readonly fillLight = new PointLight(0xefeae1, 1.2, 22, 1.5);
  private readonly creatorLight = new PointLight(0xdde6ff, 0.75, 18, 1.7);
  private readonly pointerTarget = new Vector2();
  private readonly pointerCurrent = new Vector2();

  constructor() {
    this.group.name = "DestinationEntitySystem";
    this.group.add(
      this.visuals.group,
      this.creator.group,
      this.technical.group,
    );

    this.keyLight.position.set(-3, 6, -20);
    this.fillLight.position.set(3, 2, -22);
    this.creatorLight.position.set(0, 1.5, -23);
    this.group.add(this.keyLight, this.fillLight, this.creatorLight);
  }

  setPointer(x: number, y: number) {
    this.pointerTarget.set(x, y);
  }

  tick(
    deltaSeconds: number,
    params: DestinationEntitySystemParams,
    totalTime: number,
  ) {
    const pointerDamp = params.reducedMotion ? 12 : 3;
    this.pointerCurrent.x +=
      (this.pointerTarget.x - this.pointerCurrent.x) *
      Math.min(1, deltaSeconds * pointerDamp);
    this.pointerCurrent.y +=
      (this.pointerTarget.y - this.pointerCurrent.y) *
      Math.min(1, deltaSeconds * pointerDamp);

    // Visuals and Technical still consume their proven emergence/hover kinematics.
    // The signed adapter is local to those entities and is removed in the next
    // explicit-interaction pass; the public scene contract is already neutral.
    const visualsAuthority = Math.max(
      params.interactions.visuals.hoverWeight,
      params.interactions.visuals.selectedWeight,
    );
    const technicalAuthority = Math.max(
      params.interactions.technical.hoverWeight,
      params.interactions.technical.selectedWeight,
    );
    const updateParams: EntityUpdateParams = {
      progress: params.progress,
      selectionBias: technicalAuthority - visualsAuthority,
      pointerX: this.pointerCurrent.x,
      pointerY: this.pointerCurrent.y,
      reducedMotion: params.reducedMotion,
    };

    this.visuals.tick(deltaSeconds, updateParams, totalTime);
    this.technical.tick(deltaSeconds, updateParams, totalTime);
    this.creator.tick(
      deltaSeconds,
      {
        progress: params.progress,
        interaction: params.interactions.creator,
        pointerX: this.pointerCurrent.x,
        pointerY: this.pointerCurrent.y,
        reducedMotion: params.reducedMotion,
      },
      totalTime,
    );

    if (!params.reducedMotion) {
      this.group.position.x = this.pointerCurrent.x * 0.4;
      this.group.position.y = this.pointerCurrent.y * 0.25;
    } else {
      this.group.position.set(0, 0, this.group.position.z);
    }

    const darknessFactor = 1 - params.eventDarkness * 0.85;
    this.keyLight.intensity = 1.5 * darknessFactor;
    this.fillLight.intensity = 1.2 * darknessFactor;
    this.creatorLight.intensity =
      (0.75 + params.interactions.creator.hoverWeight * 0.35) * darknessFactor;
  }

  dispose() {
    this.visuals.dispose();
    this.technical.dispose();
    this.creator.dispose();
    this.group.clear();
  }
}

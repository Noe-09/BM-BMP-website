type VeilArtifactProps = {
  kind: "signal" | "mass" | "trace";
};

export function VeilArtifact({ kind }: VeilArtifactProps) {
  return (
    <span className={`creator-veil__artifact creator-veil__artifact--${kind}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

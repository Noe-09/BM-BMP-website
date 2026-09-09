import { Container } from "@/components/ui/Container";
import { BRAND } from "@/content/brand";

export function ValueFramework() {
  return (
    <section className="bmp-value-framework" aria-label="BMP value framework">
      <Container>
        <ol>
          {BRAND.valueFramework.value.map((value, index) => (
            <li key={value}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

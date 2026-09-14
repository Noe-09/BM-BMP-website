import type { TechRegisterRow } from "@/content/tech";

type SystemsRegisterProps = {
  rows: readonly TechRegisterRow[];
};

export function SystemsRegister({ rows }: SystemsRegisterProps) {
  return (
    <section aria-labelledby="tech-systems-register-title">
      <h2 id="tech-systems-register-title">SYSTEMS REGISTER</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">SYSTEM TYPE</th>
            <th scope="col">BUSINESS PROBLEM</th>
            <th scope="col">DELIVERY</th>
            <th scope="col">STATE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.systemType}</th>
              <td>{row.businessProblem}</td>
              <td>{row.delivery}</td>
              <td>{row.capabilityState}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

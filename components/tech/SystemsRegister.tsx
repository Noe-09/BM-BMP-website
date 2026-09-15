import type { TechRegisterRow } from "@/content/tech";

type SystemsRegisterProps = {
  rows: readonly TechRegisterRow[];
};

export function SystemsRegister({ rows }: SystemsRegisterProps) {
  return (
    <section className="tech-systems-register" aria-labelledby="tech-systems-register-title" data-tech-phase-anchor="register">
      <header className="tech-systems-register__heading">
        <p>PRACTICE / CAPABILITY INDEX</p>
        <h2 id="tech-systems-register-title">SYSTEMS REGISTER</h2>
        <p>CAPABILITIES / APPLICATIONS / STATE</p>
      </header>
      <div className="tech-systems-register__table-wrap" tabIndex={0}>
        <table>
        <thead>
          <tr>
            <th scope="col">SYSTEM TYPE</th>
            <th scope="col">BUSINESS PROBLEM</th>
            <th scope="col">DELIVERY</th>
            <th scope="col">CAPABILITY STATE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" data-register-field="system-type">{row.systemType}</th>
              <td data-register-field="business-problem">{row.businessProblem}</td>
              <td data-register-field="delivery">{row.delivery}</td>
              <td data-register-field="capability-state" data-capability-state={row.capabilityState}>
                AVAILABLE
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </section>
  );
}

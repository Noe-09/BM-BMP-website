import Link from "next/link";

export function GatewayFallback() {
  return (
    <main className="gateway-fallback">
      <div className="gateway-fallback__inner">
        <p className="gateway-fallback__mark">BM</p>
        <h1>TWO WORLDS. ONE SYSTEM.</h1>
        <nav className="gateway-fallback__divisions" aria-label="BM divisions">
          <Link href="/" className="gateway-fallback__division">
            <span className="gateway-fallback__division-name">BM VISUALS</span>
            <span className="gateway-fallback__division-type">
              Creative / Digital Experience
            </span>
            <span className="gateway-fallback__division-copy">
              Digital identities
              <br />
              with motion, story and distinction.
            </span>
            <span className="gateway-fallback__action">ENTER VISUALS →</span>
          </Link>
          <Link
            href="/gateway-prototype/technical"
            className="gateway-fallback__division"
          >
            <span className="gateway-fallback__division-name">BMP TECHNICAL</span>
            <span className="gateway-fallback__division-type">
              Technology / AI Systems
            </span>
            <span className="gateway-fallback__division-copy">
              AI systems, product logic
              <br />
              and technical execution.
            </span>
            <span className="gateway-fallback__action">ENTER TECHNICAL →</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}

import styles from "./ProofStrip.module.css";

export default function ProofStrip() {
  return (
    <section className={styles["proof-strip"]} aria-label="Furute highlights">
      <div>
        <span>8,000+</span>
        <p>entrepreneurs and professionals trained</p>
      </div>
      <div>
        <span>20 Years</span>
        <p>of business trend and market insight</p>
      </div>
      <div>
        <span>Pune</span>
        <p>based coaching with practical local relevance</p>
      </div>
    </section>
  );
}

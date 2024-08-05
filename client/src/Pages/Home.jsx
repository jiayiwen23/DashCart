import styles from "./Home.module.css";
import ProductList from "../components/ProductList/ProductList";

export default function Home() {
  return (
    <div className={styles.home}>
      <h1>Today's trending products</h1>
      <ProductList />
    </div>
  );
}

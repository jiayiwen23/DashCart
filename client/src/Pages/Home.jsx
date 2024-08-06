import styles from "./Home.module.css";
import ProductList from "../components/ProductList/ProductList";

export default function Home() {
  return (
    <div className={styles.home}>
      <ProductList />
    </div>
  );
}
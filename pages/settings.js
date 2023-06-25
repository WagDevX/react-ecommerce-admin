import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Settings() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
      setIsLoading(false);
    });
  }, []);
  return (
    <Layout>
      <h1>Settings</h1>
      <label>Featured product</label>
      {isLoading && <Spinner fulllWidth={true} />}
      {!isLoading && (
        <>
          <select onChange={ev => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 && products.map((product) => (
              <option value={product._id}>{product.title}</option>
            ))}
          </select>
          <div>
            <button className="btn-primary">Save settings</button>
          </div>
        </>
      )}
    </Layout>
  );
}

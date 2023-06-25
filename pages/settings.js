import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default function Settings() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState('');
  
  useEffect(() => {
    setProductsLoading(true);
    
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
      setProductsLoading(false);
    });
    setFeaturedLoading(true);
    axios.get("/api/settings?name=featuredProductId").then((res) => {
        setFeaturedProductId(res.data.value);
        setFeaturedLoading(false);
    });
  }, []);

  async function saveSettings() {
    await axios.put("/api/settings", {
      name: "featuredProductId",
      value: featuredProductId
    })
    MySwal.fire({
        title: "Settings saved!",
        icon: "success",
    });
  }

  return (
    <Layout>
      <h1>Settings</h1>
      <label>Featured product</label>
      {(productsLoading || featuredLoading) && <Spinner fulllWidth={true} />}
      {(!productsLoading && !featuredLoading) && (
        <>
          <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 && products.map((product) => (
              <option value={product._id}>{product.title}</option>
            ))}
          </select>
          <div>
            <button 
            onClick={saveSettings}
            className="btn-primary">
                Save settings
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}

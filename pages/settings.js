import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default function Settings() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [shippingFee, setShippingFee] = useState('');
  
  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
        setIsLoading(false);
    });
  }, []);

  async function fetchAll() {
    await axios.get("/api/products").then((res) => {
      setProducts(res.data);
    });
    await axios.get("/api/settings?name=featuredProductId").then((res) => {
        setFeaturedProductId(res.data.value);
    });
    await axios.get("/api/settings?name=shippingFee").then((res) => {
        setShippingFee(res.data.value);
    });
  }

  async function saveSettings() {
    setIsLoading(true);
    await axios.put("/api/settings", {
      name: "featuredProductId",
      value: featuredProductId
    })
    await axios.put("/api/settings", {
        name: "shippingFee",
        value: shippingFee
    })
    setIsLoading(false);
    await MySwal.fire({
        title: "Settings saved!",
        icon: "success",
    });
    
  }

  return (
    <Layout>
      <h1>Settings</h1>
      <label>Featured product</label>
      {isLoading && <Spinner fulllWidth={true} />}
      {!isLoading && (
        <>
          <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 && products.map((product) => (
              <option value={product._id}>{product.title}</option>
            ))}
          </select>
          <label>Shipping price (in BRL)</label>
          <input 
          value={shippingFee} 
          onChange={ev => setShippingFee(ev.target.value)} type="number" />
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

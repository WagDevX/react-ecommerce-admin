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
  const [featuredProductId, setFeaturedProductId] = useState("");
  const [shippingFee, setShippingFee] = useState("");
  const [bannerFront, setBannerFront] = useState("https://wagner-nextjs-ecommerce.s3.sa-east-1.amazonaws.com/8865748-ai+(2).png");
  const [isUploading, setIsUploading] = useState(false);
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
    await axios.get("/api/settings?name=bannerFront").then((res) => {
      setBannerFront(res.data.value);
    })
  }

  async function saveSettings() {
    setIsLoading(true);
    await axios.put("/api/settings", {
      name: "featuredProductId",
      value: featuredProductId,
    });
    await axios.put("/api/settings", {
      name: "shippingFee",
      value: shippingFee,
    });
    await axios.put("/api/settings", {
      name: "bannerFront",
      value: bannerFront,
    })
    setIsLoading(false);
    await MySwal.fire({
      title: "Settings saved!",
      icon: "success",
    });
  }
  async function uploadeImages (ev) {
    setIsUploading(true);
    const files = ev.target?.files;
    if (files.length > 0) {

      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setBannerFront(res.data.links)
      setIsUploading(false);
    }
  }

  return (
    <Layout>
      <h1>Settings</h1>
      <label>Featured product</label>
      {isLoading && <Spinner fulllWidth={true} />}
      {!isLoading && (
        <>
          <select
            value={featuredProductId}
            onChange={(ev) => setFeaturedProductId(ev.target.value)}
          >
            {products.length > 0 &&
              products.map((product) => (
                <option key={product._id} value={product._id}>{product.title}</option>
              ))}
          </select>
          <label>Shipping price (in BRL)</label>
          <input
            value={shippingFee}
            onChange={(ev) => setShippingFee(ev.target.value)}
            type="number"
          />
          <div>
            <label>Front page Banner (size recommended: 1100 x 300 px)</label>
            <div className="mb-2 flex flex-wrap gap-2">
            {!!bannerFront && (
            <div key={bannerFront} className="h-24 bg-white p-1 shadow-sm rounded-md border border-gray-200">
              <img src={bannerFront} className="rounded-lg"></img>
            </div>
            )}
            <label className=" cursor-pointer w-24 h-24 text-center flex-col flex items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white hover:bg-gray-300 transition duration-300 ease-in shadow-sm border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              Add image
              <input type="file" onChange={uploadeImages} className="hidden"></input>
            </label>
            </div>
            <button onClick={saveSettings} className="btn-primary mt-3">
              Save settings
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}

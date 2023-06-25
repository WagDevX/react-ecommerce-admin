import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProdutPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
      setIsLoaded(true);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit Product</h1>
      {!isLoaded && <Spinner fulllWidth={true} />}

      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}

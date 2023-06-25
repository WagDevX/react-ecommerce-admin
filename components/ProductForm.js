import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [images, setImages] = useState(existingImages || []);
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState( assignedProperties|| {});
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const router = useRouter();
  useEffect(() => {
    axios.get('/api/categories/').then(result => {
      setCategories(result.data);
      setCategoriesLoaded(true);
    })
  },[]);
  async function saveProduct(ev) {
    
    ev.preventDefault();
    const data = { 
      title, description, price, images, category, 
      properties:productProperties 
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
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
      setImages(oldImages => {
        return [...oldImages, ...res.data.links]
      })
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }
  function setProductProperty(propName, value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties)
    while (catInfo.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === 
      catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
        <select 
        value={category}
        onChange={ev => setCategory(ev.target.value)}
        >
          <option value="">
            Uncategorized
          </option>
          {categories.length > 0 && categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {!categoriesLoaded && (
          <Spinner fulllWidth={true} />
        )}
        {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div className="">
            <label>{p.name}</label>
            <div>
            <select value={productProperties[p.name]}
            onChange={ev => 
            setProductProperty(p.name, ev.target.value)
            }>
              {p.values.map(v => (
                <option value={v}>{v}</option>
              ))}
            </select>
            </div>
            </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable 
        list={images} setList={updateImagesOrder}
        className="flex flex-wrap gap-1 cursor-pointer">
        {!!images?.length && images.map(link => (
          <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-md border border-gray-200">
            <img src={link} className="rounded-lg"></img>
          </div>
        ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center gap-1">
            <Spinner />
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
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in R$)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsloaded] = useState(false);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsloaded(true);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {!isLoaded && (
            <tr>
              <td colSpan={4}>
                <div className="py-4">
                  <Spinner fulllWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  {order.name} {order.email} <br />
                  {order.city} {order.zipCode} <br />
                  {order.state} {order.district} <br />
                  {order.streetAddress} {order.complement}
                </td>
                <td>
                  {order.line_items.map((line) => (
                    <>
                      {line.price_data.product_data.name} x {line.quantity}{" "}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

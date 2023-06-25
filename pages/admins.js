import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";
import axios from "axios";
import { SP } from "next/dist/shared/lib/utils";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default function AdminsPage() {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [adminsLoaded, setAdminsLoaded] = useState(false);
  function addAdmin(ev) {
    ev.preventDefault();
    axios.post("/api/admins", { email }).then((res) => {
      console.log(res.data);
      MySwal.fire({
        title: "Admin created!",
        text: "Email " + email + " added as admin with success!",
        icon: "success",
      });
      setEmail("");
      loadAdmins();
    }).catch(err => {
        if (err.message === 'Network Error') {
            MySwal.fire({
                title: "Error!",
                text: "No internet connection!",
                icon: "error",
            });
        } else {
            const json = JSON.parse(err.config.data);
            const email = json.email;
            MySwal.fire({
                title: "Error!",
                text: "Admin " + email + " already exists!",
                icon: "error",
            });
        }
    });
  }
  function loadAdmins() {
    axios.get("/api/admins").then((res) => {
      setAdminEmails(res.data);
      setAdminsLoaded(true);
    });
  }
  useEffect(() => {
    loadAdmins();
  }, []);
  async function deleteAdmin(_id, email) {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to delete " + email + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios.delete("/api/admins?id=" + _id).then((res) => {
          MySwal.fire({
            title: "Admin deleted!",
            icon: "success",
          });
        loadAdmins();
        });
      }
    });
  }
  return (
    <Layout>
      <h1>Admins</h1>
      <h2>Add new admin</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            type="text"
            className="mb-0"
            placeholder="Google email"
          />
          <button type="submit" className="btn-primary py-1 whitespace-nowrap">
            Add admin
          </button>
        </div>
      </form>
      <h2>Existing admins</h2>
      <table className="basic">
        <thead>
          <tr>
            <th className="text-left">Admin google Email</th>
            <th className="text-left">Date</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {!adminsLoaded && (
            <tr>
              <td colSpan={3}>
                <div className="py-4">
                  <Spinner fulllWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.length > 0 &&
            adminEmails.map((e) => (
              <tr>
                <td>{e.email}</td>
                <td>{e.createdAt && prettyDate(e.createdAt)}</td>
                <td key={e._id}>
                  <button
                    onClick={() => {
                      deleteAdmin(e._id, e.email);
                    }}
                    className="btn-red"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (req.method === 'POST') {
        const {email} = req.body;
        res.json(await Admin.create({email}));
    }
    if (req.method === 'GET') {
        res.json(await Admin.find());
    }
    if (req.method === 'DELETE') {
        res.json(await Admin.deleteOne({_id:req.query?.id}))
    }
}
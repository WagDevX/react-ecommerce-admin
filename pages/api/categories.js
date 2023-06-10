import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req,res) {
    const {method} = req;
    await mongooseConnect();
    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    }
    if (method === 'POST') {
        const {name, parentCategory,} = req.body;
        const cagetoryDoc = await Category.create({
            name, 
            parent:parentCategory
        });
        res.json(cagetoryDoc);
    }
    if (method === 'PUT') {
        const {name, parentCategory, _id} = req.body;
        const cagetoryDoc = await Category.updateOne({_id},{
            name, 
            parent:parentCategory,
        });
        res.json(cagetoryDoc);
    }
    if (method == 'DELETE') {
        if (req.query?.id) {
            await Category.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
    
}
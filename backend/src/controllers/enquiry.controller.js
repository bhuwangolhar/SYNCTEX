const service = require("../services/enquiry.service");

exports.getAll = async (req,res)=>{
  try{
    const data = await service.getAll(req.query.organization_id);
    res.json(data);
  }catch(err){
    res.status(400).json({message:err.message});
  }
};

exports.create = async (req,res)=>{
  try{
    const data = await service.create(req.body);
    res.status(201).json(data);
  }catch(err){
    res.status(400).json({message:err.message});
  }
};

exports.update = async (req,res)=>{
  try{
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  }catch(err){
    res.status(400).json({message:err.message});
  }
};

exports.delete = async (req,res)=>{
  try{
    await service.delete(req.params.id);
    res.json({message:"deleted"});
  }catch(err){
    res.status(400).json({message:err.message});
  }
};
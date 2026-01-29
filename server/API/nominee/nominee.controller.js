const { addnominee, getnominees, updatenominee } = require("./nominee..service");

module.exports = {
  addNominee: (req, res) => {
    const { name, department } = req.body;
    const nimage = `/uploads/${req.file.filename}`;

    addnominee({ name, department, nimage }, (err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    });
  },

  getNominees: (req, res) => {
    getnominees((err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true, data: results });
    });
  },

  updateNominee: (req, res) => {
    const {id}=req.params
    const { name, department } = req.body;
    const nimage = req.file ? `/uploads/${req.file.filename}` : null;
 console.log(id, req.body);
 console.log(nimage);
    if(!id || !name || !department){
  return res.status(566).json({success:false, message:"please fill all required fields"})
 }
    updatenominee({ id, name, department, nimage }, (err) => {
      if (err) {
        return res.status(500).json({ success: false })}
      console.log("successful");
        res.json({ success: true });
    });
  }
};

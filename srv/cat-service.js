module.exports = (srv) => {
    const { Books } = srv.entities;
  
    srv.on('READ', 'Books', async (req) => {
      return SELECT.from(Books);
    });
  
    srv.on('CREATE', 'Books', async (req) => {
      const data = req.data; 
      if(data.stock < 0){
        req.error(400, 'Stock cannot be negative');
        
      }

      return INSERT.into(Books).entries(data);
    });
  
    srv.on('UPDATE', 'Books', async (req) => {
      const data = req.data;
      const { ID } = data;
    
      if (data.stock < 0) {
        req.error(400, 'Stock cannot be negative');
      }
      
      return UPDATE(Books).set(data).where({ ID });
    });
  
    
    srv.on('DELETE', 'Books', async (req) => {
      const { ID } = req.data;
      return DELETE.from(Books).where({ ID });
    });
  };
  
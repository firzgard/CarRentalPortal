using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public class ModelRepository:IBaseRepository<Model>
    {
        CRPEntities _dataContext = new CRPEntities();
        public IEnumerable<Model> List
        {
            get
            {
                throw new NotImplementedException();
            }
        }
        public List<Model> getAllModel()
        {
            List<Model> lstModel = _dataContext.Models.ToList<Model>();
            return lstModel;
        }
        public void Add(Model entity)
        {
            _dataContext.Models.Add(entity);
            _dataContext.SaveChanges();
        }

        public void Delete(Model entity)
        {
            _dataContext.Models.Remove(entity);
            _dataContext.SaveChanges();
        }

        public Model findById(int Id)
        {
            var query = (from r in _dataContext.Models where r.ID == Id select r).FirstOrDefault();
            return query;
        }

        public void Update(Model entity)
        {
            _dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
            _dataContext.SaveChanges();
        }

        internal List<Model> getList()
        {
            throw new NotImplementedException();
        }
    }
}
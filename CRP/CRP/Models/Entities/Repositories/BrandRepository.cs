using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public class BrandRepository : IBaseRepository<Brand>
    {
        CRPEntities _dataContext;
        public BrandRepository()
        {
            _dataContext = new CRPEntities();
        }

        IEnumerable<Brand> IBaseRepository<Brand>.List
        {
            get
            {
                return _dataContext.Brands;
            }
        }
        public List<Brand> getList()
        {
            var list = _dataContext.Brands.ToList<Brand>();
            return list;
        }
        public void Add(Brand entity)
        {
            _dataContext.Brands.Add(entity);
            _dataContext.SaveChanges();
        }

        public void Delete(Brand entity)
        {
            _dataContext.Brands.Remove(entity);
            _dataContext.SaveChanges();
        }

        public void Update(Brand entity)
        {
            _dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
            _dataContext.SaveChanges();
        }
        public Brand findById(int Id)
        {
            var query = (from r in _dataContext.Brands where r.ID == Id select r).FirstOrDefault();
            return query;
        }
    }
}
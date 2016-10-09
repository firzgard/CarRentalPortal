using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public class PriceGroupRepository : IBaseRepository<PriceGroup>
    {
        CRPEntities _dataContext;

        public PriceGroupRepository()
        {
            _dataContext = new CRPEntities();
        }


        public IEnumerable<PriceGroup> List
        {
            get
            {
                return _dataContext.PriceGroups;
            }
        }

        public void Add(PriceGroup entity)
        {
            _dataContext.PriceGroups.Add(entity);
            _dataContext.SaveChanges();
        }

        public void Delete(PriceGroup entity)
        {
            _dataContext.PriceGroups.Remove(entity);
            _dataContext.SaveChanges();
        }

        public PriceGroup findById(int Id)
        {
            var query = (from r in _dataContext.PriceGroups where r.ID == Id select r).FirstOrDefault();
            return query;
        }

        public void Update(PriceGroup entity)
        {
            _dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
            _dataContext.SaveChanges();
        }
    }
}
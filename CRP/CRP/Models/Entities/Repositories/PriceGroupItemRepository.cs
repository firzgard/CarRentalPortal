using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public class PriceGroupItemRepository : IBaseRepository<PriceGroupItem>
    {
        CRPEntities _dataContext;

        public PriceGroupItemRepository()
        {
            _dataContext = new CRPEntities();
        }


        public IEnumerable<PriceGroupItem> List
        {
            get
            {
                return _dataContext.PriceGroupItems;
            }
        }

        public void Add(PriceGroupItem entity)
        {
            _dataContext.PriceGroupItems.Add(entity);
            _dataContext.SaveChanges();
        }

        public void Delete(PriceGroupItem entity)
        {
            _dataContext.PriceGroupItems.Remove(entity);
            _dataContext.SaveChanges();
        }

        public PriceGroupItem findById(int Id)
        {
            var query = (from r in _dataContext.PriceGroupItems where r.ID == Id select r).FirstOrDefault();
            return query;
        }

        public void Update(PriceGroupItem entity)
        {
            _dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
            _dataContext.SaveChanges();
        }
    }
}
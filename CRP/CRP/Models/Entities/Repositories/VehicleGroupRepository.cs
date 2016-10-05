using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public class VehicleGroupRepository : IBaseRepository<VehicleGroup>
    {
        CRPEntities _dataContext;

        public VehicleGroupRepository() 
        {
            _dataContext = new CRPEntities();
        }

        public IEnumerable<VehicleGroup> List
        {
            get
            {
                return _dataContext.VehicleGroups;
            }
        }

        public List<VehicleGroup> getList()
        {
            return _dataContext.VehicleGroups.ToList<VehicleGroup>();
        }

        public void Add(VehicleGroup entity)
        {
            _dataContext.VehicleGroups.Add(entity);
            _dataContext.SaveChanges();
        }

        public void Delete(VehicleGroup entity)
        {
            _dataContext.VehicleGroups.Remove(entity);
            _dataContext.SaveChanges();
        }

        public VehicleGroup findById(int Id)
        {
            var query = (from r in _dataContext.VehicleGroups where r.ID == Id select r).FirstOrDefault();
            return query;
        }

        public void Update(VehicleGroup entity)
        {
            _dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
            _dataContext.SaveChanges();
        }
    }
}
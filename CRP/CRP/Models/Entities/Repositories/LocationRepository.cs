using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public class LocationRepository : IBaseRepository<Location>
    {
        CRPEntities _dataContext = new CRPEntities();
        public IEnumerable<Location> List
        {
            get
            {
                throw new NotImplementedException();
            }
        }
        public List<Location> getAllLocation()
        {
            List<Location> lstLocation = _dataContext.Locations.ToList<Location>();
            return lstLocation;
        }
        
        public void Add(Location entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(Location entity)
        {
            throw new NotImplementedException();
        }

        public Location findById(int Id)
        {
            var query = (from r in _dataContext.Locations where r.ID == Id select r).FirstOrDefault();
            return query;
        }

        public void Update(Location entity)
        {
            throw new NotImplementedException();
        }
    }
}
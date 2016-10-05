using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public class LocationService
    {
        LocationRepository _repository = new LocationRepository();
        public Location findByID(int id)
        {
            Location location = _repository.findById(id);
            return location;
        }
        public String findLocalNameByID(int id)
        {
            Location location = _repository.findById(id);
            if (location == null)
            {
                return "SomeWhere";
            }
            return location.Name;
        }
        public List<Location> getAll()
        {
            List<Location> lstLocation = new List<Location>();
            lstLocation = _repository.getAllLocation();
            return lstLocation;
        }
    }
}
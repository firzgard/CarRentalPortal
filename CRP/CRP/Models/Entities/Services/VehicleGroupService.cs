using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public class VehicleGroupService
    {
        public static VehicleGroupService getInstance()
        {
             return new VehicleGroupService();
        }

        VehicleGroupRepository _repository = new VehicleGroupRepository();

        public List<VehicleGroup> getAll()
        {
            List<VehicleGroup> listVehicleGroup = new List<VehicleGroup>();
            listVehicleGroup = _repository.getList();
            return listVehicleGroup;
        }

        public bool add(VehicleGroup entity)
        {
            try
            {
                _repository.Add(entity);
            }
            catch(Exception e)
            {
                e.GetHashCode();
                return false;
            }
            return true;
        }

        public bool update(VehicleGroup entity)
        {
            try
            {
                _repository.Update(entity);
            }
            catch(Exception e)
            {
                e.GetHashCode();
                return false;
            }
            return true;
        }

        public bool delete(VehicleGroup entity)
        {
            try
            {
                _repository.Delete(entity);
            }
            catch(Exception e)
            {
                e.GetHashCode();
                return false;
            }
            return true;
        }
    }
}
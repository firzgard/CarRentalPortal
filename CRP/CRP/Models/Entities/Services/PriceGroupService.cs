using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public class PriceGroupService
    {
        PriceGroupRepository _repository = new PriceGroupRepository();

        public List<PriceGroup> getAll()
        {
            List<PriceGroup> listVehicleGroup = new List<PriceGroup>();
            listVehicleGroup = _repository.List.ToList();
            return listVehicleGroup;
        }

        public bool add(PriceGroup entity)
        {
            try
            {
                _repository.Add(entity);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
            return true;
        }

        public bool update(PriceGroup entity)
        {
            try
            {
                _repository.Update(entity);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
            return true;
        }

        public bool delete(PriceGroup entity)
        {
            try
            {
                _repository.Delete(entity);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
            return true;
        }

        public PriceGroup findByID(int id)
        {
            return _repository.findById(id);
        }
    }
}
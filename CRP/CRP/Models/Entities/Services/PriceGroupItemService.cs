using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public class PriceGroupItemService
    {
        PriceGroupItemRepository _repository = new PriceGroupItemRepository();
        public List<PriceGroupItem> getAll()
        {
            List<PriceGroupItem> listVehicleGroup = new List<PriceGroupItem>();
            listVehicleGroup = _repository.List.ToList();
            return listVehicleGroup;
        }

        public bool add(PriceGroupItem entity)
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

        public bool update(PriceGroupItem entity)
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

        public bool delete(PriceGroupItem entity)
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

        public PriceGroupItem findByID(int id)
        {
            return _repository.findById(id);
        }
    }
}
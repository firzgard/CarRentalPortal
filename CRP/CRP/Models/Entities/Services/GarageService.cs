using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
	public class GarageService 
	{
        GarageRepository _repository = new GarageRepository();
        public Boolean add(Garage brand)
        {
            try
            {
                _repository.Add(brand);
            }
            catch (Exception e)
            {
                e.GetHashCode();
                return false;
            }
            return true;
        }

        public Boolean delete(int ID)
        {
            Garage deleteBrand = _repository.findById(ID);
            if (deleteBrand == null)
            {
                return false;
            }
            else
            {
                try
                {
                    _repository.Delete(deleteBrand);
                }
                catch (Exception e)
                {
                    e.GetHashCode();
                    return false;
                }
                return true;
            }
        }
        public List<Garage> getAll()
        {
            List<Garage> lstBrand = new List<Garage>();
            lstBrand = _repository.getAllGarage();
            return lstBrand;
        }
    }
}
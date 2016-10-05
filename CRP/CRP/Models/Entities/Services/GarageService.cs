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
        public Boolean add(Garage garege)
        {
            try
            {
                _repository.Add(garege);
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
            Garage deleteGarage = _repository.findById(ID);
            if (deleteGarage == null)
            {
                return false;
            }
            else
            {
                try
                {
                    _repository.Delete(deleteGarage);
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
        public List<Garage> findByUser(int UserID)
        {
            List<Garage> lstGarage = new List<Garage>();
            return lstGarage;
        }
        public Garage findByID(int id)
        {
            Garage garage = _repository.findById(id);
            return garage;
        }
        public Boolean Update(Garage garage)
        {
            try
            {
                _repository.Update(garage);
            } catch (Exception e)
            {
                e.GetHashCode();
                return false;
            }
          
            return true;
        }

        public Boolean doActive(int id)
        {
            Garage garage = _repository.findById(id);
            if (garage == null)
            {
                return false;
            }
            try
            {   if (garage.IsActive)
                {
                    garage.IsActive = false;
                } else
                {
                    garage.IsActive = true;
                }
                _repository.Update(garage);
            }
            catch (Exception e)
            {
                e.GetBaseException();
                return false;
            }
            return true;
        }
    }
}
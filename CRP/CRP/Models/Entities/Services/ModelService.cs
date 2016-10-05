using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public class ModelService
    {
        ModelRepository _repository = new ModelRepository();
        public Boolean add(Model model)
        {
            try
            {
                _repository.Add(model);
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
            Model deleteModel = _repository.findById(ID);
            if (deleteModel == null)
            {
                return false;
            }
            else
            {
                try
                {
                    _repository.Delete(deleteModel);
                }
                catch (Exception e)
                {
                    e.GetHashCode();
                    return false;
                }
                return true;
            }
        }
        public List<Model> getAll()
        {
            List<Model> lstModel = new List<Model>();
            lstModel = _repository.getList();
            return lstModel;
        }
        public Boolean UpdateModel(Model model)
        {
            Model sModel = _repository.findById(model.ID);
            if (sModel == null)
            {
                return false;
            }
            try
            {
                _repository.Update(model);
            }
            catch (Exception e)
            {
                e.GetBaseException();
                return false;
            }
            return true;
        }
        public Model findByID(int ID)
        {
            Model model = _repository.findById(ID);
            return model;
        }
        public String reModelNameByID(int ID)
        {
            Model model = _repository.findById(ID);
            return model.Model1;
        }
        public int findBrandID(int ID)
        {
            Model model = _repository.findById(ID);
            return model.BrandID;
        }
        public int reNumOfDoorByID(int ID)
        {
            Model model = _repository.findById(ID);
            return model.NumOfDoor;
        }
        public int reNumOfSeatByID(int ID)
        {
            Model model = _repository.findById(ID);
            return model.NumOfSeat;
        }
    }
}
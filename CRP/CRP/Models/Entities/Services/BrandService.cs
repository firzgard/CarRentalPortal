using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public class BrandService
    {
        BrandRepository _repository = new BrandRepository();
        public Boolean add(Brand brand)
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
            Brand deleteBrand = _repository.findById(ID);
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
        public List<Brand> getAll()
        {
            List<Brand> lstBrand = new List<Brand>();
            lstBrand = _repository.getList();
            return lstBrand;
        }
    }
}
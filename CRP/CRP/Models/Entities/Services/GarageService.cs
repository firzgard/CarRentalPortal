using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
	public interface IGarageService : IService<Garage>
    {
        List<Garage> GetGarageList(string customerID);
    }
    public class GarageService :BaseService<Garage>, IGarageService
    {
        public GarageService(IUnitOfWork unitOfWork, IGarageRepository repository) :base(unitOfWork, repository)
        {

        }

        public List<Garage> GetGarageList(string customerID)
        {
            var bookingReceiptList = this.repository.Get();
            List<Garage> lstGarage = bookingReceiptList
                 .Where(q => q.OwnerID == customerID)
                 .OrderByDescending(q => q.ID)
                 .ToList();
            return lstGarage;
        }
    }
}